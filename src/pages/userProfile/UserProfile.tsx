import {
    ChangeEvent,
    useEffect,
    useState
} from "react";

import styles from "./UserProfile.module.css";

type UserData = {
    name: string;
    email: string;
    phone: string;

    imageProfile?: string;

    address: {
        street: string;
        city: string;
        state: string;
        zip: string;
    };

    roles: string[];
};

export function UserProfile() {

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [globalLoading, setGlobalLoading] =
        useState(false);

    const [showModal, setShowModal] =
        useState(false);

    const [selectedImage, setSelectedImage] =
        useState<File | null>(null);

    const [previewImage, setPreviewImage] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [removeImage, setRemoveImage] =
        useState(false);

    const [userData, setUserData] =
        useState<UserData>({
            name: "",
            email: "",
            phone: "",

            imageProfile: "",

            address: {
                street: "",
                city: "",
                state: "",
                zip: ""
            },

            roles: []
        });

    /* =========================
       LOAD USER
    ========================== */

    useEffect(() => {
        loadUser();
    }, []);

    async function loadUser() {

        try {

            const token =
                localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:8080/api/users/data",
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) return;

            const data = await response.json();

            setUserData({
                name: data.name || "",
                email: data.email || "",
                phone: formatPhone(
                    data.phone || ""
                ),

                imageProfile:
                    data.imageProfile || "",

                address: {
                    street:
                        data.address?.street || "",

                    city:
                        data.address?.city || "",

                    state:
                        data.address?.state || "",

                    zip:
                        formatZipCode(
                            data.address?.zip || ""
                        )
                },

                roles:
                    data.roles || []
            });

            setPreviewImage(
                data.imageProfile || ""
            );

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);
        }
    }

    /* =========================
       FORMAT
    ========================== */

    function formatPhone(
        value: string
    ) {

        const numbers =
            value.replace(/\D/g, "");

        if (numbers.length <= 10) {

            return numbers.replace(
                /(\d{2})(\d{4})(\d{0,4})/,
                "($1) $2-$3"
            );
        }

        return numbers.replace(
            /(\d{2})(\d{5})(\d{0,4})/,
            "($1) $2-$3"
        );
    }

    function formatZipCode(
        value: string
    ) {

        const numbers =
            value.replace(/\D/g, "");

        return numbers.replace(
            /(\d{5})(\d{0,3})/,
            "$1-$2"
        );
    }

    /* =========================
       INPUT CHANGE
    ========================== */

    function handleChange(
        field: keyof UserData,
        value: string
    ) {

        setUserData((prev) => ({
            ...prev,
            [field]: value
        }));
    }

    function handleAddressChange(
        field: keyof UserData["address"],
        value: string
    ) {

        setUserData((prev) => ({
            ...prev,

            address: {
                ...prev.address,
                [field]: value
            }
        }));
    }

    /* =========================
       ZIPCODE
    ========================== */

    async function handleZipCode(
        value: string
    ) {

        const formatted =
            formatZipCode(value);

        handleAddressChange(
            "zip",
            formatted
        );

        const numbers =
            value.replace(/\D/g, "");

        if (numbers.length !== 8) {
            return;
        }

        try {

            setGlobalLoading(true);

            const response = await fetch(
                `http://localhost:8080/api/addresses?zipCode=${numbers}`
            );

            if (!response.ok) return;

            const data =
                await response.json();

            setUserData((prev) => ({
                ...prev,

                address: {
                    zip:
                        formatZipCode(
                            data.zipCode || numbers
                        ),

                    street:
                        data.address || "",

                    city:
                        data.city || "",

                    state:
                        data.state || ""
                }
            }));

        } catch (error) {

            console.error(error);

        } finally {

            setGlobalLoading(false);
        }
    }

    /* =========================
       IMAGE
    ========================== */

    function handleImageUpload(
        event: ChangeEvent<HTMLInputElement>
    ) {

        const file =
            event.target.files?.[0];

        if (!file) return;

        setRemoveImage(false);

        setSelectedImage(file);

        const reader = new FileReader();

        reader.onloadend = () => {

            setPreviewImage(
                reader.result as string
            );
        };

        reader.readAsDataURL(file);
    }

    function handleRemoveImage() {

        setSelectedImage(null);

        setPreviewImage("");

        setRemoveImage(true);

        setUserData((prev) => ({
            ...prev,
            imageProfile: ""
        }));
    }

    /* =========================
       SAVE
    ========================== */

    async function handleSave() {

        if (password !== confirmPassword) {

            alert("As senhas não coincidem.");

            return;
        }

        try {

            setSaving(true);

            const token =
                localStorage.getItem("token");

            let imageProfile =
                removeImage
                    ? ""
                    : userData.imageProfile || "";

            if (selectedImage || removeImage) {

                const formData =
                    new FormData();

                if (selectedImage) {

                    formData.append(
                        "image",
                        selectedImage
                    );
                }

                const uploadResponse =
                    await fetch(
                        "http://localhost:8080/api/users/upload/image/profile",
                        {
                            method: "PUT",

                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            },

                            body: formData
                        }
                    );

                if (!uploadResponse.ok) {

                    alert(
                        "Erro ao atualizar imagem."
                    );

                    return;
                }

                const uploadData =
                    await uploadResponse.json();

                imageProfile =
                    removeImage
                        ? ""
                        : uploadData.imageProfile || "";
            }

            const response =
                await fetch(
                    "http://localhost:8080/api/users/update",
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${token}`
                        },

                        body: JSON.stringify({
                            imageProfile,
                            email: userData.email,
                            name: userData.name,
                            password: password || "",
                            phone: userData.phone,

                            address: {
                                street:
                                    userData.address.street,

                                city:
                                    userData.address.city,

                                state:
                                    userData.address.state,

                                zip:
                                    userData.address.zip
                                        .replace(/\D/g, "")
                            },

                            roles:
                                userData.roles
                        })
                    }
                );

            if (!response.ok) {

                alert(
                    "Erro ao salvar alterações."
                );

                return;
            }

            setShowModal(true);

            setTimeout(() => {

                window.location.reload();

            }, 1000);

        } catch (error) {

            console.error(error);

            alert(
                "Erro ao salvar alterações."
            );

        } finally {

            setSaving(false);
        }
    }

    if (loading) {

        return (
            <div className={styles.loading}>
                Carregando...
            </div>
        );
    }

    return (
        <>
            {/* GLOBAL LOADING */}

            {globalLoading && (
                <div
                    className={
                        styles.globalLoadingOverlay
                    }
                >
                    <div
                        className={styles.loadingDots}
                    >
                        <span />
                        <span />
                        <span />
                    </div>
                </div>
            )}

            <div className={styles.container}>

                <div className={styles.card}>

                    <h1 className={styles.title}>
                        Minha Conta
                    </h1>

                    {/* PROFILE */}

                    <div className={styles.profileSection}>

                        <div className={styles.profileImageWrapper}>

                            <img
                                src={
                                    previewImage ||
                                    "/icons/profile-icon.jpg"
                                }
                                alt="Perfil"
                                className={
                                    styles.profileImage
                                }
                            />

                            {(previewImage ||
                                userData.imageProfile) && (
                                    <div className={styles.imageOverlay}>

                                        <button
                                            type="button"
                                            className={
                                                styles.removeOverlayButton
                                            }
                                            onClick={
                                                handleRemoveImage
                                            }
                                        >
                                            Remover foto
                                        </button>

                                    </div>
                                )}

                        </div>

                        <label
                            className={
                                styles.uploadButton
                            }
                        >
                            Alterar foto

                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={
                                    handleImageUpload
                                }
                            />
                        </label>

                    </div>

                    {/* GRID */}

                    <div className={styles.grid}>

                        <div className={styles.field}>
                            <label>Nome</label>

                            <input
                                value={userData.name}
                                onChange={(e) =>
                                    handleChange(
                                        "name",
                                        e.target.value
                                    )
                                }
                            />
                        </div>

                        <div className={styles.field}>
                            <label>Email</label>

                            <input
                                value={userData.email}
                                disabled
                                onChange={(e) =>
                                    handleChange(
                                        "email",
                                        e.target.value
                                    )
                                }
                            />
                        </div>

                        <div className={styles.field}>
                            <label>Telefone</label>

                            <input
                                value={userData.phone}
                                onChange={(e) =>
                                    handleChange(
                                        "phone",
                                        formatPhone(
                                            e.target.value
                                        )
                                    )
                                }
                            />
                        </div>

                        <div className={styles.field}>
                            <label>CEP</label>

                            <input
                                value={
                                    userData.address.zip
                                }
                                onChange={(e) =>
                                    handleZipCode(
                                        e.target.value
                                    )
                                }
                            />
                        </div>

                        <div className={styles.field}>
                            <label>Rua</label>

                            <input
                                value={
                                    userData.address.street
                                }
                                readOnly
                            />
                        </div>

                        <div className={styles.field}>
                            <label>Cidade</label>

                            <input
                                value={
                                    userData.address.city
                                }
                                readOnly
                            />
                        </div>

                        <div className={styles.field}>
                            <label>Estado</label>

                            <input
                                value={
                                    userData.address.state
                                }
                                readOnly
                            />
                        </div>

                        <div className={styles.field}>
                            <label>Nova senha</label>

                            <input
                                type="password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(
                                        e.target.value
                                    )
                                }
                            />
                        </div>

                        <div className={styles.field}>
                            <label>
                                Confirmar senha
                            </label>

                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(
                                        e.target.value
                                    )
                                }
                            />
                        </div>

                    </div>

                    {/* SAVE */}

                    <div className={styles.saveWrapper}>

                        <button
                            className={styles.saveButton}
                            onClick={handleSave}
                            disabled={saving}
                        >
                            {saving ? (
                                <div className={styles.loadingDots}>
                                    <span />
                                    <span />
                                    <span />
                                </div>
                            ) : (
                                "Salvar alterações"
                            )}
                        </button>

                    </div>

                </div>

            </div>

            {/* MODAL */}

            {showModal && (

                <div
                    className={
                        styles.modalOverlay
                    }
                >

                    <div className={styles.modal}>

                        <h2>
                            Dados atualizados
                        </h2>

                        <p>
                            Suas alterações foram
                            salvas com sucesso.
                        </p>

                        <button
                            className={
                                styles.modalButton
                            }
                            onClick={() =>
                                setShowModal(false)
                            }
                        >
                            Fechar
                        </button>

                    </div>

                </div>
            )}
        </>
    );
}