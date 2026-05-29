import { useEffect, useState } from "react";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area,
    LineChart,
    Line,
    ScatterChart,
    Scatter,
    ZAxis
} from "recharts";

import styles from "./Dashbord.module.css";

const COLORS = [
    "#2563eb",
    "#16a34a",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4"
];

type Dashboard = {
    totalProposals: number;

    avgDiscount: number;
    avgInstallment: number;
    avgCashPayment: number;

    biggestDiscount: number;
    lowestInstallment: number;
    lowestCashPayment: number;
};

type BestOffer = {
    dealershipName: string;
    state: string;

    installment: number;
    cashPayment: number;
    discount: number;

    totalFinanced: number;
    discountPercent: number;
};

type DealershipRanking = {
    dealershipId: string;
    dealershipName: string;
    state: string;

    avgDiscount: number;
    avgInstallment: number;
    avgCashPayment: number;

    proposals: number;

    score: number;
};

type RegionalMetrics = {
    state: string;

    avgDiscount: number;
    avgInstallment: number;
    avgCashPayment: number;

    minInstallment: number;
    maxDiscount: number;

    proposals: number;
};

type VehicleRanking = {
    vehicleModelName: string;
    proposals: number;

    avgDiscount: number;
    avgInstallment: number;
    avgVehiclePrice: number;

    biggestDiscount: number;
    lowestInstallment: number;
};

export function Dashbord() {

    const [dashboard, setDashboard] = useState<Dashboard | null>(null);

    const [bestOffers, setBestOffers] = useState<BestOffer[]>([]);

    const [dealershipRanking, setDealershipRanking] = useState<DealershipRanking[]>([]);

    const [regionalMetrics, setRegionalMetrics] = useState<RegionalMetrics[]>([]);

    const [vehicles, setVehicles] = useState<VehicleRanking[]>([]);

    const [loading, setLoading] = useState(true);

    const formatCurrency = (value?: number) => {

        if (!value) {
            return "R$ 0";
        }

        return value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    };

    useEffect(() => {

        const token = localStorage.getItem("token");

        const headers = {
            Authorization: `Bearer ${token}`
        };

        Promise.all([
            fetch(
                "http://localhost:8080/api/analytics/proposals/dashboard",
                { headers }
            ),

            fetch(
                "http://localhost:8080/api/analytics/proposals/best/offers",
                { headers }
            ),

            fetch(
                "http://localhost:8080/api/analytics/proposals/ranking",
                { headers }
            ),

            fetch(
                "http://localhost:8080/api/analytics/proposals/regional",
                { headers }
            ),

            fetch(
                "http://localhost:8080/api/analytics/proposals/most/quoted/vehicles",
                { headers }
            )
        ])
            .then(async ([
                dashboardRes,
                bestOffersRes,
                dealershipRes,
                regionalRes,
                vehiclesRes
            ]) => {

                setDashboard(await dashboardRes.json());

                setBestOffers(await bestOffersRes.json());

                setDealershipRanking(await dealershipRes.json());

                setRegionalMetrics(await regionalRes.json());

                setVehicles(await vehiclesRes.json());

                setLoading(false);
            });

    }, []);

    if (loading) {

        return (
            <div className={styles.loading}>
                <div className={styles.loader} />
            </div>
        );
    }

    return (
        <div className={styles.page}>

            <main className={styles.content}>

                <div className={styles.header}>

                    <div>

                        <h1>
                            Proposal Analytics
                        </h1>

                        <p>
                            Dashboard executivo com métricas financeiras,
                            regionais e comerciais das propostas.
                        </p>

                    </div>

                </div>

                {/* KPI */}

                <section className={styles.section}>

                    <div className={styles.sectionHeader}>

                        <h2 className={styles.sectionTitle}>
                            Visão geral
                        </h2>

                        <p className={styles.sectionDescription}>
                            Indicadores principais das propostas cadastradas.
                        </p>

                    </div>

                    <div className={styles.cards}>

                        <div className={styles.card}>
                            <span>Total de propostas</span>

                            <strong>
                                {dashboard?.totalProposals}
                            </strong>

                            <small>
                                Quantidade total registrada
                            </small>
                        </div>

                        <div className={styles.card}>
                            <span>Desconto médio concedido</span>

                            <strong>
                                {formatCurrency(dashboard?.avgDiscount)}
                            </strong>

                            <small>
                                Média entre todas as ofertas
                            </small>
                        </div>

                        <div className={styles.card}>
                            <span>Maior desconto encontrado</span>

                            <strong>
                                {formatCurrency(dashboard?.biggestDiscount)}
                            </strong>

                            <small>
                                Melhor negociação disponível
                            </small>
                        </div>

                        <div className={styles.card}>
                            <span>Menor parcela registrada</span>

                            <strong>
                                {formatCurrency(dashboard?.lowestInstallment)}
                            </strong>

                            <small>
                                Melhor condição de financiamento
                            </small>
                        </div>

                    </div>

                </section>

                {/* GRÁFICOS */}

                <section className={styles.section}>

                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>
                            Performance comercial
                        </h2>

                        <p className={styles.sectionDescription}>
                            Comparativo entre concessionárias e veículos.
                        </p>
                    </div>

                    <div className={styles.grid2}>

                        <div className={styles.chartCard}>

                            <div className={styles.chartTitle}>
                                Ranking de concessionárias
                            </div>

                            <ResponsiveContainer width="100%" height={320}>

                                <BarChart data={dealershipRanking.slice(0, 6)}>

                                    <CartesianGrid strokeDasharray="3 3" />

                                    <XAxis dataKey="dealershipName" />

                                    <YAxis />

                                    <Tooltip />

                                    <Bar
                                        dataKey="avgDiscount"
                                        fill="#2563eb"
                                        radius={[8, 8, 0, 0]}
                                    />

                                </BarChart>

                            </ResponsiveContainer>

                        </div>

                        <div className={styles.chartCard}>

                            <div className={styles.chartTitle}>
                                Veículos mais cotados
                            </div>

                            <ResponsiveContainer width="100%" height={320}>

                                <PieChart>

                                    <Pie
                                        data={vehicles}
                                        dataKey="proposals"
                                        nameKey="vehicleModelName"
                                        outerRadius={110}
                                        label
                                    >

                                        {vehicles.map((_, index) => (

                                            <Cell
                                                key={index}
                                                fill={COLORS[index % COLORS.length]}
                                            />

                                        ))}

                                    </Pie>

                                    <Tooltip />

                                </PieChart>

                            </ResponsiveContainer>

                        </div>

                    </div>

                </section>

                {/* REGIONAL */}

                <section className={styles.section}>

                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>
                            Análise regional
                        </h2>

                        <p className={styles.sectionDescription}>
                            Descontos médios por estado.
                        </p>
                    </div>

                    <div className={styles.chartCard}>

                        <ResponsiveContainer width="100%" height={350}>

                            <AreaChart data={regionalMetrics}>

                                <CartesianGrid strokeDasharray="3 3" />

                                <XAxis dataKey="state" />

                                <YAxis />

                                <Tooltip />

                                <Area
                                    type="monotone"
                                    dataKey="avgDiscount"
                                    stroke="#16a34a"
                                    fill="#bbf7d0"
                                />

                            </AreaChart>

                        </ResponsiveContainer>

                    </div>

                </section>

                {/* SCATTER */}

                <section className={styles.section}>

                    <div className={styles.sectionHeader}>

                        <h2 className={styles.sectionTitle}>
                            Relação parcela x desconto
                        </h2>

                        <p className={styles.sectionDescription}>
                            Quanto maior o desconto, maior tende a ser o financiamento.
                        </p>

                    </div>

                    <div className={styles.chartCard}>

                        <ResponsiveContainer width="100%" height={350}>

                            <ScatterChart>

                                <CartesianGrid />

                                <XAxis
                                    type="number"
                                    dataKey="installment"
                                    name="Parcela"
                                />

                                <YAxis
                                    type="number"
                                    dataKey="discount"
                                    name="Desconto"
                                />

                                <ZAxis range={[100]} />

                                <Tooltip />

                                <Scatter
                                    data={bestOffers}
                                    fill="#2563eb"
                                />

                            </ScatterChart>

                        </ResponsiveContainer>

                    </div>

                </section>

                {/* LINE */}

                <section className={styles.section}>

                    <div className={styles.sectionHeader}>

                        <h2 className={styles.sectionTitle}>
                            Parcelas médias por concessionária
                        </h2>

                        <p className={styles.sectionDescription}>
                            Comparativo financeiro entre redes.
                        </p>

                    </div>

                    <div className={styles.chartCard}>

                        <ResponsiveContainer width="100%" height={350}>

                            <LineChart data={dealershipRanking.slice(0, 8)}>

                                <CartesianGrid strokeDasharray="3 3" />

                                <XAxis dataKey="dealershipName" />

                                <YAxis />

                                <Tooltip />

                                <Line
                                    type="monotone"
                                    dataKey="avgInstallment"
                                    stroke="#f59e0b"
                                    strokeWidth={3}
                                />

                            </LineChart>

                        </ResponsiveContainer>

                    </div>

                </section>

                {/* TABLE */}

                <section className={styles.section}>

                    <div className={styles.sectionHeader}>

                        <h2 className={styles.sectionTitle}>
                            Melhores ofertas
                        </h2>

                        <p className={styles.sectionDescription}>
                            Ranking das melhores condições comerciais.
                        </p>

                    </div>

                    <div className={styles.tableCard}>

                        <table className={styles.table}>

                            <thead>

                                <tr>
                                    <th>Concessionária</th>
                                    <th>Estado</th>
                                    <th>Parcela</th>
                                    <th>Entrada</th>
                                    <th>Desconto</th>
                                </tr>

                            </thead>

                            <tbody>

                                {bestOffers.slice(0, 10).map((offer, index) => (

                                    <tr key={index}>

                                        <td>{offer.dealershipName}</td>

                                        <td>{offer.state}</td>

                                        <td>
                                            {formatCurrency(offer.installment)}
                                        </td>

                                        <td>
                                            {formatCurrency(offer.cashPayment)}
                                        </td>

                                        <td className={styles.discount}>
                                            {formatCurrency(offer.discount)}
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                </section>

            </main>

        </div>
    );
}