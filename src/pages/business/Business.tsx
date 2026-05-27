import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./Business.module.css";

type Proposal = {
    id: string;

    dealership: {
        image?: string;
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

type ProposalCardProps = {
    proposal: Proposal;
};

function ProposalCard({ proposal }: ProposalCardProps) {

    const [showContact, setShowContact] = useState(false);

    return (
        <div className={styles.card}>

            <div className={styles.top}>

                <img
                    src={
                        proposal.dealership.image ||
                        "/images/imagem-concessionario.jpeg"
                    }
                    className={styles.image}
                    alt={proposal.dealership.name}
                />

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
                    R$ {proposal.businessItem.installment.toLocaleString(
                        "pt-BR",
                        {
                            minimumFractionDigits: 2
                        }
                    )}
                </div>

                <div className={styles.installmentText}>
                    Em {proposal.businessItem.quantity}x com entrada de R$ {" "}
                    {proposal.businessItem.cashPayment.toLocaleString(
                        "pt-BR",
                        {
                            minimumFractionDigits: 2
                        }
                    )}
                </div>

                <div className={styles.discountRow}>

                    <span>
                        Você recebeu um desconto de:
                    </span>

                    <strong>
                        R$ {proposal.businessItem.discount.toLocaleString(
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

                    <div>
                        📍 {proposal.dealership.address}
                    </div>

                    <div>
                        📞 {proposal.dealership.phone}
                    </div>

                    <div>
                        ✉️ {proposal.dealership.email}
                    </div>

                </div>

            )}

        </div>
    );
}

export function Business() {

    const { id } = useParams();

    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [finished, setFinished] = useState(false);


    useEffect(() => {

        if (!id) return;

        async function connect() {

            try {

                const token = localStorage.getItem("token");

                console.log("Car ID:", id);

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

                console.log("STATUS:", response.status);

                if (!response.ok) {
                    console.error("Erro SSE");
                    return;
                }

                const reader = response.body?.getReader();

                if (!reader) {
                    console.error("Reader null");
                    return;
                }

                const decoder = new TextDecoder();

                let buffer = "";

                while (true) {

                    const { value, done } = await reader.read();

                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });

                    const events = buffer.split("\n\n");

                    buffer = events.pop() || "";

                    for (const event of events) {

                        console.log("EVENTO:", event);

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

                        console.log("EVENT:", eventName);
                        console.log("DATA:", data);

                        if (eventName === "proposal") {

                            const proposal = JSON.parse(data);

                            setProposals(prev => [...prev, proposal]);
                        }

                        if (eventName === "finished") {
                            setFinished(true);
                        }
                    }
                }

            } catch (err) {
                console.error(err);
            }
        }

        connect();

    }, [id]);


    console.log("RENDER PROPOSALS", proposals);

    return (
        <div className={styles.page}>

            <div className={styles.header}>

                <h1>
                    Ofertas disponíveis
                </h1>

                {!finished && (
                    <div className={styles.loadingDots}>
                        <span />
                        <span />
                        <span />
                    </div>
                )}

            </div>

            <div className={styles.grid}>

                {proposals.map((proposal) => (
                    <ProposalCard
                        key={proposal.id}
                        proposal={proposal}
                    />
                ))}

                {!finished && (
                    <div className={styles.loadingCard}>

                        <div className={styles.loadingDotsCenter}>
                            <span />
                            <span />
                            <span />
                        </div>

                    </div>
                )}

            </div>

        </div>
    );
}