import { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import "cordova-plugin-purchase/www/store.js";
import {
    SwipeableDrawer,
    Button,
    Box,
    Typography,
    Divider,
    Stack,
    Radio,
    RadioGroup,
    Card,
    CardContent
} from "@mui/material";
import useLocales from "src/hooks/useLocales";


const { store, ProductType, Platform } = window.CdvPurchase || {};
const platformName = Capacitor.getPlatform() === "android" ? Platform.GOOGLE_PLAY : Platform.APPLE_APPSTORE;
const productId = "pro.videos.hundred";

const productIds = ["pro.snowmatch.oneshot", "pro.snowmatch.progress", "pro.videos.hundred"]

const memberships = [
    {
        id: "pro.snowmatch.oneshot",
        name: "Single Shot",
        price: "$10 USD",
        benefits: [
            "📹 1 corrección de video por un experto",
            "🧠 Snowmatch Intelligence",
            "🎯 Perfecto para probar la experiencia"
        ]
    },
    {
        id: "pro.snowmatch.progress",
        name: "Progress Pack",
        price: "$50 USD",
        benefits: [
            "📹 10 correcciones de video para mejorar progresivamente",
            "🧠 Snowmatch Intelligence",
            "🔥 Desbloquea tu siguiente nivel de esquí"
        ]
    },
    {
        id: "pro.videos.hundred",
        name: "Master Pack",
        price: "$100 USD",
        benefits: [
            "📹 100 correcciones de video para un entrenamiento intensivo",
            "🧠 Snowmatch Intelligence",
            "🥇 Acceso exclusivo a contenido premium"
        ]
    },
];

const PremiumContainer = ({
    open,
    onClose,
    onOpen,
}) => {
    const [iapProduct, setIapProduct] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const {translate} = useLocales();
    const [selectedMembership, setSelectedMembership] = useState("basic");


    useEffect(() => {
        if (!window.CdvPurchase || !window.CdvPurchase.store) {
            console.error("❌ CdvPurchase no está disponible.");
            return;
        }

        const { store, ProductType, Platform } = window.CdvPurchase;
        store.verbosity = store.DEBUG;

        console.log("🛒 Registrando productos...");
        store.register([
            {
                id: productIds[0],
                type: ProductType.CONSUMABLE,
                platform: Platform.APPLE_APPSTORE
            },
            {
                id: productIds[1],
                type: ProductType.CONSUMABLE,
                platform: Platform.APPLE_APPSTORE
            },
            {
                id: productIds[2],
                type: ProductType.CONSUMABLE,
                platform: Platform.APPLE_APPSTORE
            },
        ]);
        console.log("🛒 Inicializando tienda...");
        store
            .initialize([Platform.APPLE_APPSTORE])
            .then(() => {
                console.log("✅ Tienda inicializada con éxito.");

                // store.refresh();
            })
            .catch((err) => {
                console.error("❌ Error al inicializar la tienda:", JSON.stringify(err));
            });
    }, []);

    useEffect(() => {
        async function setupStore() {
            try {
                console.log("[DEBUG] Iniciando configuración de la tienda...");

                // Verificar si el plugin está disponible
                if (!store) {
                    throw new Error("CdvPurchase no está disponible. ¿El plugin está instalado correctamente?");
                }

                // if (store.isInitialized()) {
                //     console.warn("[CdvPurchase] La tienda ya está inicializada.");
                //     return;
                // }

                console.log("[DEBUG] Inicializando store...");
                store.verbosity = store.DEBUG;

                // Intentar inicializar la tienda
                console.log("[DEBUG] Tienda inicializada con éxito.");

                // Registrar el producto
                store.register([
                    {
                        id: productIds[0],
                        type: ProductType.CONSUMABLE,
                        platform: Platform.APPLE_APPSTORE
                    },
                    {
                        id: productIds[1],
                        type: ProductType.CONSUMABLE,
                        platform: Platform.APPLE_APPSTORE
                    },
                    {
                        id: productIds[2],
                        type: ProductType.CONSUMABLE,
                        platform: Platform.APPLE_APPSTORE
                    },
                ]);

                console.log("[DEBUG] Producto registrado:", productId);

                // Esperar a que la tienda esté lista
                // await store.ready();
                console.log("[DEBUG] Tienda lista.");

                // Refrescar la tienda para cargar los productos
                // await store.refresh();
                console.log("[DEBUG] Tienda actualizada.");

                // Escuchar cambios en el producto
                store.when(productId).productUpdated((product) => {
                    console.log("[DEBUG] Producto actualizado:", product);
                    setIapProduct(product);
                });

                // Manejar compra aprobada
                store.when(productId).approved((product) => {
                    console.log("[DEBUG] Compra aprobada:", product);
                    product.finish();
                });

                setLoading(false);
            } catch (error) {
                console.error("❌ Error al configurar la tienda:", error);
                setErrorMessage(error.message || JSON.stringify(error));
                setLoading(false);
            }
        }

        setupStore();
    }, []);

    const orderProduct = async () => {
        if (!iapProduct) {
            console.error("❌ El producto aún no está disponible.");
        }

        try {
            console.log("[DEBUG] Intentando comprar:", store.get(selectedMembership));
            await store.order(store.get(selectedMembership).offers[0]);
            console.log("✅ Compra iniciada");
        } catch (error) {
            console.error("❌ Error al iniciar la compra:", JSON.stringify(error));
            setErrorMessage(error.message || JSON.stringify(error));
        }
    };

    return (

        <Box width="100%">
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <RadioGroup
                    sx={{ width: "100%" }}
                    value={selectedMembership}
                    onChange={(e) => setSelectedMembership(e.target.value)}
                >
                    {memberships.map((membership) => {
                        const isEnabled = true

                        return (
                            <Card
                                key={membership.id}
                                sx={{
                                    mb: 2,
                                    width: "100%",
                                    borderRadius: 2,
                                    border: selectedMembership === membership.id && isEnabled
                                        ? "2px solid #1976d2"
                                        : "2px solid transparent",
                                    transition: "0.3s",
                                    opacity: isEnabled ? 1 : 0.6, // Baja opacidad para las deshabilitadas
                                    position: "relative",
                                    "&:hover": isEnabled ? { boxShadow: 3 } : {}, // No aplicar hover si está deshabilitado
                                }}
                                onClick={() => isEnabled && setSelectedMembership(membership.id)} // Solo seleccionable si está habilitado
                            >
                                <CardContent sx={{py:2}}>
                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                                        <Radio sx={{ display: "none" }} value={membership.id} disabled={!isEnabled} />
                                        <Box sx={{ flexGrow: 1, pl: 1 }}>
                                            <Typography variant="h6">
                                                {translate(`memberships.${membership.id}.name`)}{" "}
                                                <Typography component="span" color="textSecondary">
                                                    ({membership.price})
                                                </Typography>
                                            </Typography>
                                            <Box component="ul" sx={{ pl: 2, mt: 1 }}>
                                                {membership.benefits.map((benefit, idx) => (
                                                    <Typography key={benefit} variant="body2" component="li">
                                                         {translate(`memberships.${membership.id}.benefits.${idx+1}`)}
                                                    </Typography>
                                                ))}
                                            </Box>
                                        </Box>
                                    </Box>
                                    {!isEnabled && (
                                        <Box
                                            sx={{
                                                position: "absolute",
                                                top: 0,
                                                left: 0,
                                                width: "100%",
                                                height: "100%",
                                                backgroundColor: "rgba(0,0,0,0.2)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                borderRadius: 2,
                                            }}
                                        >
                                            <Typography variant="body1" color="white" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
                                                Próximamente
                                            </Typography>
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </RadioGroup>
            </Box>
            {/* Botones de acción */}
            <Stack spacing={2}>
                <Button variant="outlined" color="primary" onClick={orderProduct} fullWidth>
                    Probar compra
                </Button>
            </Stack>
        </Box>
    );
};

export default PremiumContainer;