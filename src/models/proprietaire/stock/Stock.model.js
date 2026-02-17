const mongoose = require("mongoose");

const prefixeId = "stk_";

const stockSchema = new mongoose.Schema(
    {
        _id: {
            type: String
        },
        idSource: {
            type: String,
        },
        idBoutique: {
            type: String,
            required: true
        },
        idTypeMvtStock: {
            type: String,
            values: ['Entrer', 'Sortie'],
            required: true
        },
        designation: {
            type: String,
            required: true,
            trim: true
        },
        date: {
            type: Date,
            default: Date.now
        },
        status: {
            type: Number,
            default: 1
        }
    },
    {
        collection:"stock",
        timestamps:false
    }
);

stockSchema.pre("save", async function() {
    if (!this._id) {
        const uniquePart = Date.now().toString(36); // simple et efficace
        this._id = `${prefixeId}${uniquePart}`;
    }
});

module.exports = mongoose.model("Stock", stockSchema);

// const StockDetails = require("./stockDetails.model");
// const Produit = require("../produit/Produit.model");

// export class StockEntity {
//
//     static async validateStockMouvement(stock,filles) {
//         if (filles==null){
//             filles = await StockDetails.find({ idMere: stock._id });
//         }
//
//         const totalsByProduit = new Map();
//         for (const detail of filles) {
//             const key = String(detail.idProduit);
//             const current = totalsByProduit.get(key) || { entree: 0, sortie: 0 };
//             totalsByProduit.set(key, {
//                 entree: current.entree + (detail.entree || 0),
//                 sortie: current.sortie + (detail.sortie || 0),
//             });
//         }
//
//         let listProduits = [];
//         for (const [idProduit, totals] of totalsByProduit.entries()) {
//             const produit = await Produit.findById(idProduit);
//             if (!produit) continue;
//
//             const quantiteInitiale = produit.quantite || 0;
//             const quantiteApresEntree = quantiteInitiale + (totals.entree || 0);
//
//             if ((totals.sortie || 0) > 0 && quantiteApresEntree < totals.sortie) {
//                 throw new Error(`Stock insuffisant pour le produit ${produit.nom}. Disponible: ${quantiteApresEntree}, Demandé: ${totals.sortie}`);
//             }
//
//             produit.quantite = quantiteApresEntree - (totals.sortie || 0);
//             listProduits.push(produit);
//         }
//
//         // Mettre à jour la quantité de chaque produit
//         for (const produit of listProduits) {
//             await produit.save();
//         }
//
//         if (stock.status !== ConstanteEtat.VALIDER) {
//             stock.status = ConstanteEtat.VALIDER;
//             await stock.save();
//         }
//         return stock;
//     }
//
// }
