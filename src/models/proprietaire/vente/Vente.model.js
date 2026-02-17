const mongoose = require("mongoose");

const prefixeId = "v_";

const venteSchema = new mongoose.Schema(
    {
        _id: {
            type: String
        },
        idBoutique: {
            type: String,
            required: true
        },
        idClient: {
            type: String,
            required: true
        },
        designation: {
            type: String,
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
        collection:"vente",
        timestamps:false
    }
);

venteSchema.pre("save", async function() {
    if (!this._id) {
        const uniquePart = Date.now().toString(36); // simple et efficace
        this._id = `${prefixeId}${uniquePart}`;
    }
});

module.exports = mongoose.model("Vente", venteSchema);

// const Stock = require("../stock/Stock.model");
// const StockDetails = require("../stock/stockDetails.model");
// const VenteDetails = require("./VenteDetails.model");
//
// export class VenteEntity {
//     static async genererMouvementStock(vente, filles) {
//         try {
//             if (filles == null) {
//                 filles = await VenteDetails.find({ idMere: vente._id });
//             }
//
//             let mouvementStock = new Stock({
//                 idSource: vente._id,
//                 idBoutique: vente.idBoutique,
//                 idTypeMvtStock: ConstanteEtat.idTypeMvtStock.SORTIE,
//                 designation: `Vente ${vente._id} - Client ${vente.idClient}`,
//                 status: 11
//             });
//
//             let mvtStockDetails = [];
//
//             for (let detail of filles) {
//                 let mvtStockDetail = new StockDetails({
//                     idProduit: detail.idProduit,
//                     sortie: detail.quantite,
//                     remarque: detail.remarque
//                 });
//                 mvtStockDetails.push(mvtStockDetail);
//             }
//
//             await StockEntity.validateStockMouvement(mouvementStock, mvtStockDetails);
//
//             await mouvementStock.save();
//             for (const detail of mvtStockDetails) {
//                 detail.idMere = mouvementStock._id;
//                 await detail.save();
//             }
//
//             return mouvementStock;
//
//         } catch (error) {
//             // ✅ Log et propagation
//             console.error("Erreur dans genererMouvementStock:", error);
//             throw error; // ✅ Important : propage l'erreur
//         }
//     }
// }
