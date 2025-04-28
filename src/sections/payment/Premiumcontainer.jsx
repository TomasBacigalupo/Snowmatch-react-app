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
    CardContent,
    AvatarGroup,
    Avatar,
    Grid
} from "@mui/material";
import useLocales from "src/hooks/useLocales";
import useAuth from "src/hooks/useAuth";
import { addCredits } from "src/redux/slices/video";
import { useDispatch } from "src/redux/store";


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
    const { translate } = useLocales();
    const [selectedMembership, setSelectedMembership] = useState("basic");
    const { user } = useAuth()
    const dispatch = useDispatch()

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

                console.log("[DEBUG] Inicializando store...");
                store.verbosity = store.DEBUG;

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


                // Escuchar cambios en el producto
                store.when(productId).productUpdated((product) => {
                    console.log("[DEBUG] Producto actualizado:", product);
                    setIapProduct(product);
                });

                // Manejar compra aprobada
                productIds.map(p => {
                    store.when(p).approved((product) => {
                        console.log("[DEBUG] Compra aprobada:", product);
                        if (product.state === 'approved') {
                            dispatch(addCredits(user.id, 1))
                        }
                        product.finish();
                    });
                })


                setLoading(false);
            } catch (error) {
                console.error("❌ Error al configurar la tienda:", error);
                setErrorMessage(error.message || JSON.stringify(error));
                setLoading(false);
            }
        }

        setupStore();
    }, []);

    const orderProduct = async (id) => {
        if (!iapProduct) {
            console.error("❌ El producto aún no está disponible.");
        }

        try {
            console.log("[DEBUG] Intentando comprar:", store.get(id));
            await store.order(store.get(id).offers[0]);
            console.log("✅ Compra iniciada");
        } catch (error) {
            console.error("❌ Error al iniciar la compra:", JSON.stringify(error));
            setErrorMessage(error.message || JSON.stringify(error));
        }
    };

    const handleSelect = (id) => {
        setSelectedMembership(id)
        orderProduct(id)
    }

    return (
        <Grid container direction="row" alignItems="center" px={2} pt={1}>
            <Grid item xs={12}>
                <Stack direction="column" alignItems="center" spacing={1}>
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <AvatarGroup max={3} sx={{ "& .MuiAvatar-root": { width: 48, height: 48, border: "2px solid white" } }}>
                            <Avatar src="/assets/pro/1.png" />
                            <Avatar src="/assets/pro/2.png" />
                            <Avatar src="/assets/pro/3.png" />
                        </AvatarGroup>
                    </Box><Typography variant="h6" fontWeight="bold">
                        {translate("reviewRequestBox.title")}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                        {translate("reviewRequestBox.subtitle")}
                    </Typography>
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
                                            onClick={() => handleSelect(membership.id)} // Solo seleccionable si está habilitado
                                        >
                                            <CardContent sx={{ py: 2 }}>
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
                                                                    {translate(`memberships.${membership.id}.benefits.${idx + 1}`)}
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
                    </Box>
                </Stack>
            </Grid>
        </Grid>
    );
};

export default PremiumContainer;