import { useEffect, useMemo, useRef, useState } from "react";
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

const loadingMessages = [
    "Estamos buscando as melhores ofertas para você!",
    "Aqui você você fecha o melhor negócio para o seu novo Honda.",
    "Nossos preços são imbatíveis"
];

function LoadingDots() {
    return (
        <div className={styles.loadingDots}>
            <span />
            <span />
            <span />
        </div>
    );
}

function ProposalCard({ proposal }: { proposal: Proposal }) {
    const [showContact, setShowContact] = useState(false);

    return (
        <div className={styles.card}>
            <div className={styles.top}>
                <div>
                    <div className={styles.name}>
                        {proposal.dealership.name}
                    </div>

                    <div className={styles.state}>
                        {proposal.dealership.city} - {proposal.dealership.state}
                    </div>
                </div>
            </div>

            <div className={styles.valuesBox}>
                <div className={styles.installment}>
                    R${" "}
                    {proposal.businessItem.installment.toLocaleString(
                        "pt-BR",
                        {
                            minimumFractionDigits: 2
                        }
                    )}
                </div>

                <div className={styles.installmentText}>
                    Em {proposal.businessItem.quantity}x com entrada de
                    R${" "}
                    {proposal.businessItem.cashPayment.toLocaleString(
                        "pt-BR",
                        {
                            minimumFractionDigits: 2
                        }
                    )}
                </div>

                <div className={styles.discountRow}>
                    <span>Você recebeu um desconto de:</span>

                    <strong>
                        R${" "}
                        {proposal.businessItem.discount.toLocaleString(
                            "pt-BR",
                            {
                                minimumFractionDigits: 2
                            }
                        )}
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
    const [finished, setFinished] = useState(false);
    const [messageIndex, setMessageIndex] = useState(0);

    const started = useRef(false);

    const customer = proposals[0];

    const hasFirstProposal = proposals.length > 0;

    const loadingMessage = useMemo(
        () => loadingMessages[messageIndex],
        [messageIndex]
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex((prev) =>
                prev === loadingMessages.length - 1 ? 0 : prev + 1
            );
        }, 3000);

        return () => clearInterval(interval);
    }, []);

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

        if (started.current) return;
        started.current = true;

        const connect = async () => {
            try {
                const token = localStorage.getItem("token");

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

                    buffer += decoder.decode(value, {
                        stream: true
                    });

                    const events = buffer.split("\n\n");

                    buffer = events.pop() || "";

                    for (const event of events) {
                        const lines = event.split("\n");

                        let eventName = "";
                        let data = "";

                        for (const line of lines) {
                            if (line.startsWith("event:")) {
                                eventName = line
                                    .replace("event:", "")
                                    .trim();
                            }

                            if (line.startsWith("data:")) {
                                data = line
                                    .replace("data:", "")
                                    .trim();
                            }
                        }

                        if (eventName === "proposal") {
                            const proposal = JSON.parse(data);

                            setProposals((prev) => {
                                const exists = prev.some(
                                    (p) => p.id === proposal.id
                                );

                                if (exists) return prev;

                                return [...prev, proposal];
                            });
                        }

                        if (eventName === "finished") {
                            setFinished(true);
                        }
                    }
                }
            } catch (err) {
                console.error(err);
            }
        };

        connect();
    }, [id]);

    return (
        <div className={styles.page}>

            {!hasFirstProposal && (
                <div className={styles.initialLoadingOverlay}>
                    <LoadingDots />
                </div>
            )}

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
                                    R${" "}
                                    {customer.vehiclePrice.toLocaleString(
                                        "pt-BR"
                                    )}
                                </p>
                            </div>

                            <div className={styles.summaryItem}>
                                <label>Cotação</label>
                                <p>
                                    {formatDate(customer.createdAt)}
                                </p>
                            </div>

                            <div className={styles.summaryItem}>
                                <label>Validade</label>
                                <p>
                                    {formatDate(customer.finishedAt)}
                                </p>
                            </div>

                            <div className={styles.summaryItem}>
                                <label>Status</label>

                                <p className={styles.activeStatus}>
                                    {finished
                                        ? "Finalizado"
                                        : "Em andamento"}
                                </p>
                            </div>

                        </div>
                    )}
                </div>

                {/* DIVISOR */}
                <div className={styles.divider} />

                {/* TEXTO LOADING */}
                {!finished && (
                    <div className={styles.loadingMessage}>
                        <span>{loadingMessage}</span>

                        <div className={styles.loadingDotsInline}>
                            <span />
                            <span />
                            <span />
                        </div>
                    </div>
                )}

                {/* GRID */}
                <div className={styles.proposalsWrapper}>

                    <div className={styles.proposalsGrid}>

                        {proposals.map((proposal) => (
                            <ProposalCard
                                key={proposal.id}
                                proposal={proposal}
                            />
                        ))}

                        {!finished && hasFirstProposal && (
                            <div className={styles.loadingCard}>
                                <LoadingDots />
                            </div>
                        )}

                    </div>

                </div>

            </div>

            <Footer />

        </div>
    );
}