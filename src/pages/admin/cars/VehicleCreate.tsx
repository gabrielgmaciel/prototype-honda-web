// src/pages/admin/cars/VehicleCreate.tsx

import {
  useEffect,
  useRef,
  useState
} from "react";

import {
  useNavigate,
  useParams
} from "react-router-dom";

import styles from "./VehicleCreate.module.css";

type Item = {
  label: string;
  description: string;
};

export function VehicleCreate() {

  const navigate = useNavigate();
  const { id } = useParams();

  const coverInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");

  const [coverPreview, setCoverPreview] = useState("");
  const [bannerPreview, setBannerPreview] = useState("");

  const [images, setImages] = useState<string[]>([]);
  const [items, setItems] = useState<Item[]>([
    { label: "", description: "" }
  ]);

  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [loading, setLoading] = useState(false);

  /* =========================
     LOAD VEHICLE
  ========================== */
  async function loadVehicle() {

    if (!id) return;

    try {

      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:8080/api/cars?id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!res.ok) return;

      const data = await res.json();

      setName(data.name || "");
      setDescription(data.description || "");
      setCategory(data.category || "");

      const numeric =
        typeof data.price === "string"
          ? parseFloat(data.price)
          : data.price;

      if (!isNaN(numeric)) {
        setPrice(
          numeric.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })
        );
      }

      setCoverPreview(data.cover || "");
      setBannerPreview(data.banner || "");

      setImages(Array.isArray(data.images) ? data.images : []);

      setItems(
        Array.isArray(data.itens) && data.itens.length > 0
          ? data.itens
          : [{ label: "", description: "" }]
      );

    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadVehicle();
  }, [id]);

  /* =========================
     PRICE FORMAT
  ========================== */
  function handlePriceChange(value: string) {

    const onlyNumbers = value.replace(/\D/g, "");
    const numeric = Number(onlyNumbers) / 100;

    setPrice(
      numeric.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    );
  }

  /* =========================
     COVER UPLOAD
  ========================== */
  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {

    const file = e.target.files?.[0];
    if (!file || !id) return;

    try {

      setUploadingCover(true);

      const token = localStorage.getItem("token");

      const form = new FormData();
      form.append("image", file);

      await fetch(
        `http://localhost:8080/api/cars/upload/cover?id=${id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: form
        }
      );

      await loadVehicle();

    } finally {
      setUploadingCover(false);
    }
  }

  /* =========================
     BANNER UPLOAD
  ========================== */
  async function handleBannerUpload(e: React.ChangeEvent<HTMLInputElement>) {

    const file = e.target.files?.[0];
    if (!file || !id) return;

    try {

      setUploadingBanner(true);

      const token = localStorage.getItem("token");

      const form = new FormData();
      form.append("image", file);

      await fetch(
        `http://localhost:8080/api/cars/upload/banner?id=${id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: form
        }
      );

      await loadVehicle();

    } finally {
      setUploadingBanner(false);
    }
  }

  /* =========================
     IMAGES UPLOAD (MAX 11)
  ========================== */
  async function handleImagesUpload(e: React.ChangeEvent<HTMLInputElement>) {

    const files = e.target.files;

    if (!files || !id) return;

    const selected = Array.from(files);

    if (images.length + selected.length > 11) {
      alert("Limite máximo de 11 imagens");
      e.target.value = "";
      return;
    }

    try {

      setUploadingImages(true);

      const token = localStorage.getItem("token");

      const form = new FormData();

      selected.forEach(file => {
        form.append("images", file);
      });

      await fetch(
        `http://localhost:8080/api/cars/upload/images?id=${id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: form
        }
      );

      await loadVehicle();

    } finally {
      setUploadingImages(false);
      e.target.value = "";
    }
  }

  /* =========================
     ITEMS
  ========================== */
  function handleItemChange(
    index: number,
    field: keyof Item,
    value: string
  ) {

    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  }

  function addItem() {
    setItems([...items, { label: "", description: "" }]);
  }

  function removeItem(index: number) {
    setItems(items.filter((_, i) => i !== index));
  }

  /* =========================
     SAVE
  ========================== */
  async function handleSubmit(e: React.FormEvent) {

    e.preventDefault();

    setLoading(true);

    try {

      const token = localStorage.getItem("token");

      const numericPrice = Number(
        price.replace(/\./g, "").replace(",", ".")
      );

      await fetch("http://localhost:8080/api/cars", {
        method: id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          id,
          name,
          description,
          price: numericPrice,
          category,
          itens: items
        })
      });

      navigate("/admin/cars");

    } finally {
      setLoading(false);
    }
  }

  /* =========================
     UI
  ========================== */
  return (
    <div className={styles.container}>

      {/* HEADER */}
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>
          {id ? "Editar veículo" : "Novo veículo"}
        </h1>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>

        {/* BASIC */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            Dados Básicos
          </h2>

          <div className={styles.vehicleHeader}>

            <div className={styles.coverContainer}>
              <div className={styles.coverWrapper}>

                {coverPreview ? (
                  <img
                    src={coverPreview}
                    className={styles.coverImage}
                  />
                ) : (
                  <div className={styles.emptyCover}>
                    Sem imagem
                  </div>
                )}

                <div className={styles.coverOverlay}>
                  <button
                    type="button"
                    className={styles.editCoverButton}
                    onClick={() =>
                      coverInputRef.current?.click()
                    }
                  >
                    {uploadingCover ? "Enviando..." : "Editar"}
                  </button>
                </div>

              </div>

              <input
                type="file"
                hidden
                ref={coverInputRef}
                onChange={handleCoverUpload}
              />
            </div>

            <div className={styles.vehicleInfo}>

              <div className={styles.field}>
                <label className={styles.label}>Nome</label>
                <input
                  className={styles.input}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Categoria</label>
                <input
                  className={styles.input}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Preço</label>

                <div className={styles.priceInputWrapper}>
                  <span className={styles.currency}>R$</span>
                  <input
                    className={styles.priceInput}
                    value={price}
                    onChange={(e) =>
                      handlePriceChange(e.target.value)
                    }
                  />
                </div>
              </div>

            </div>

          </div>

          <div className={styles.descriptionContainer}>
            <label className={styles.label}>Descrição</label>
            <textarea
              className={styles.textarea}
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
            />
          </div>
        </div>

        {/* BANNER */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Banner</h2>

          <div className={styles.bannerPreview}>
            {bannerPreview && (
              <img
                src={bannerPreview}
                className={styles.bannerImage}
              />
            )}

            <div className={styles.bannerOverlay}>
              <button
                type="button"
                className={styles.editBannerButton}
                onClick={() =>
                  bannerInputRef.current?.click()
                }
              >
                {uploadingBanner ? "Enviando..." : "Editar"}
              </button>
            </div>
          </div>

          <input
            type="file"
            hidden
            ref={bannerInputRef}
            onChange={handleBannerUpload}
          />
        </div>

        {/* IMAGES */}
        <div className={styles.section}>
          <div className={styles.imagesHeader}>
            <div>
              <h2 className={styles.sectionTitle}>
                Galeria
              </h2>
              <p className={styles.imagesSubtitle}>
                {images.length}/9 imagens
              </p>
            </div>

            <label className={styles.uploadImagesButton}>
              {uploadingImages ? "Enviando..." : "Adicionar"}

              <input
                type="file"
                multiple
                hidden
                onChange={handleImagesUpload}
              />
            </label>
          </div>

          <div className={styles.imagesGridWrapper}>
            <div className={styles.imagesGrid}>
              {images.map((img, i) => (
                <div key={i} className={styles.galleryCard}>
                  <img
                    src={img}
                    className={styles.galleryImage}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ITEMS */}
        <div className={styles.section}>
          <div className={styles.itemsHeader}>
            <h2 className={styles.sectionTitle}>
              Itens do veículo
            </h2>

            <button
              type="button"
              className={styles.addItemButton}
              onClick={addItem}
            >
              Adicionar
            </button>
          </div>

          <div className={styles.itemsGrid}>
            {items.map((item, i) => (
              <div key={i} className={styles.itemCard}>
                <div className={styles.itemCardHeader}>
                  <span className={styles.itemIndex}>
                    Item {i + 1}
                  </span>

                  <button
                    type="button"
                    className={styles.removeItemButton}
                    onClick={() => removeItem(i)}
                  >
                    Remover
                  </button>
                </div>

                <div className={styles.itemFields}>
                  <input
                    className={styles.input}
                    placeholder="Nome"
                    value={item.label}
                    onChange={(e) =>
                      handleItemChange(i, "label", e.target.value)
                    }
                  />

                  <input
                    className={styles.input}
                    placeholder="Descrição"
                    value={item.description}
                    onChange={(e) =>
                      handleItemChange(i, "description", e.target.value)
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SAVE */}
        <div className={styles.submitWrapper}>
          <button
            className={styles.submitButton}
            type="submit"
            disabled={loading}
          >
            {loading ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>

      </form>
    </div>
  );
}