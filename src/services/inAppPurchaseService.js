// import { Capacitor } from "@capacitor/core";
// import "cordova-plugin-purchase/www/store.js";

// const { store, ProductType, Platform } = window.CdvPurchase;

// export const getProducts = async (productIds) => {
//      // Espera la inicialización del plugin (si es necesario)
//      await InAppPurchase.init();

//     try {
//         // Asegúrate de que el plugin esté correctamente inicializado
//         if (!InAppPurchase) {
//             console.error("InAppPurchase plugin not initialized.");
//             throw new Error("InAppPurchase plugin not initialized.");
//         }

//         // Verificar que `getProducts` está disponible
//         if (typeof InAppPurchase.getProducts !== 'function') {
//             console.error("getProducts function is not available on InAppPurchase.");
//             throw new Error("getProducts function is not available.");
//         }

//         const products = await InAppPurchase.getProducts(productIds);
//         console.log("Products fetched:", products);
//         return products;
//     } catch (error) {
//         console.error("Error fetching products:", error.message);
//         throw error;
//     }
// };

// export const buyProduct = async (productId) => {
//     // Espera la inicialización del plugin (si es necesario)
//     console.log("log1", window?.store?.products)
//     await InAppPurchase.init();
//     console.log("log2", InAppPurchase)
//     getProducts(["5_CREDITS"]);
//     try {
//         const purchase = await InAppPurchase.buy("5_CREDITS");
//         console.log("Purchase successful:", purchase);
//         return purchase;
//     } catch (error) {
//         console.log("Purchase failed:", error);
//         throw error;
//     }
// };

// export const restorePurchases = async () => {
//     // Espera la inicialización del plugin (si es necesario)
//     await InAppPurchase.init();

//     try {
//         const purchases = await InAppPurchase.restorePurchases();
//         console.log("Restored purchases:", purchases);
//         return purchases;
//     } catch (error) {
//         console.error("Failed to restore purchases:", error);
//         throw error;
//     }
// };