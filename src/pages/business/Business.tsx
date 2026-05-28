import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Footer } from "../../components/Footer/Footer";
import styles from "./Business.module.css";

type Proposal = {
    id: string;
    proposalCode: string;
    customerName: string;
    vehicleModelName: string;
    vehiclePrice: number;
    createdAt: string;
    finishedAt: string;

    dealership: {
        name: string;
        city: string;
        state: string;
        address: string;
        phone: string;
        email: string;
    };

    businessItem: {
        installment: number;
        quantity: number;
        cashPayment: number;
        discount: number;
    };
};

function ProposalCard({ proposal }: { proposal: Proposal }) {
    const [showContact, setShowContact] = useState(false);

    return (
        <div className={styles.card}>
            <div className={styles.top}>
                <div>
                    <div className={styles.name}>{proposal.dealership.name}</div>
                    <div className={styles.state}>
                        {proposal.dealership.city} - {proposal.dealership.state}
                    </div>
                </div>
            </div>

            <div className={styles.valuesBox}>
                <div className={styles.installment}>
                    R$ {proposal.businessItem.installment.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2
                    })}
                </div>

                <div className={styles.installmentText}>
                    Em {proposal.businessItem.quantity}x com entrada de R${" "}
                    {proposal.businessItem.cashPayment.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2
                    })}
                </div>

                <div className={styles.discountRow}>
                    <span>Você recebeu um desconto de:</span>
                    <strong>
                        R$ {proposal.businessItem.discount.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2
                        })}
                    </strong>
                </div>
            </div>

            {!showContact ? (
                <button
                    className={styles.button}
                    onClick={() => setShowContact(true)}
                >
                    Contatar
                </button>
            ) : (
                <div className={styles.contactBox}>
                    <div>📍 {proposal.dealership.address}</div>
                    <div>📞 {proposal.dealership.phone}</div>
                    <div>✉️ {proposal.dealership.email}</div>
                </div>
            )}
        </div>
    );
}

export function Business() {
    const { id } = useParams();

    const [proposals, setProposals] = useState<Proposal[]>([]);

    const started = useRef(false); // 👈 BLOQUEIA DUPLA EXECUÇÃO
    const abortControllerRef = useRef<AbortController | null>(null);

    const customer = proposals[0];

    const formatDate = (date?: string) => {
        if (!date) return "-";
        return new Date(date).toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    useEffect(() => {
        if (!id) return;

        const connect = async () => {
            const token = localStorage.getItem("token");

            // 👇 impede segunda execução (StrictMode)
            if (started.current) return;
            started.current = true;

            const controller = new AbortController();
            abortControllerRef.current = controller;

            const response = await fetch(
                `http://localhost:8080/api/business/new/proposal/${id}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "text/event-stream"
                    }
                }
            );

            if (!response.ok || !response.body) return;

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const events = buffer.split("\n\n");
                buffer = events.pop() || "";

                for (const event of events) {
                    const lines = event.split("\n");

                    let eventName = "";
                    let data = "";

                    for (const line of lines) {
                        if (line.startsWith("event:")) {
                            eventName = line.replace("event:", "").trim();
                        }
                        if (line.startsWith("data:")) {
                            data = line.replace("data:", "").trim();
                        }
                    }

                    if (eventName === "proposal") {
                        const proposal = JSON.parse(data);

                        setProposals(prev => {
                            const exists = prev.some(p => p.id === proposal.id);
                            if (exists) return prev;
                            return [...prev, proposal];
                        });
                    }

                    if (eventName === "finished") {
                        setFinished(true);
                    }
                }
            }
        };

        connect();
    }, [id]);

    return (
        <div className={styles.page}>
            <div className={styles.pageCentered}>

                {/* CARD RESUMO */}
                <div className={styles.summaryCard}>

                    <div className={styles.summaryHeader}>
                        <h2>Resumo da Cotação</h2>

                        <span className={styles.summaryBadge}>
                            {customer?.proposalCode || "Carregando..."}
                        </span>
                    </div>

                    {customer && (
                        <div className={styles.summaryGrid}>

                            <div className={styles.summaryItem}>
                                <label>Cliente</label>
                                <p>{customer.customerName}</p>
                            </div>

                            <div className={styles.summaryItem}>
                                <label>Veículo</label>
                                <p>{customer.vehicleModelName}</p>
                            </div>

                            <div className={styles.summaryItem}>
                                <label>Valor</label>
                                <p>
                                    R$ {customer.vehiclePrice.toLocaleString("pt-BR")}
                                </p>
                            </div>

                            <div className={styles.summaryItem}>
                                <label>Cotação</label>
                                <p>{formatDate(customer.createdAt)}</p>
                            </div>

                            <div className={styles.summaryItem}>
                                <label>Validade</label>
                                <p>{formatDate(customer.finishedAt)}</p>
                            </div>

                            <div className={styles.summaryItem}>
                                <label>Status</label>
                                <p className={styles.activeStatus}>Em andamento</p>
                            </div>

                        </div>
                    )}
                </div>

                {/* DIVISOR */}
                <div className={styles.divider} />

                {/* GRID PROPOSTAS */}
                <div className={styles.proposalsWrapper}>
                    <div className={styles.proposalsGrid}>
                        {proposals.map((proposal) => (
                            <ProposalCard key={proposal.id} proposal={proposal} />
                        ))}
                    </div>
                </div>

            </div>
            <Footer />
        </div>
    );
}