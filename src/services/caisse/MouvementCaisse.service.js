const ConstanteEtat = require("../../config/constante").ConstanteEtat;
const Caisse = require("../../models/caisse/Caisse.model");

class MouvementCaisseService {
    static async valider(mouvementCaisse) {
        let caisse = await Caisse.findById(mouvementCaisse.idCaisse);
        if (!caisse) throw new Error("Caisse introuvable");

        caisse.total_debit += mouvementCaisse.debit;
        caisse.total_credit += mouvementCaisse.credit;
        caisse.solde += mouvementCaisse.debit;
        caisse.solde -= mouvementCaisse.credit;
        if (caisse.solde<0){
            throw new Error("Solde insuffisant pour valider ce mouvement");
        }

        await caisse.save();
        if (mouvementCaisse.status !== ConstanteEtat.VALIDER) {
            mouvementCaisse.status = ConstanteEtat.VALIDER;
            await mouvementCaisse.save();
        }
        return mouvementCaisse;
    }
}

module.exports = { MouvementCaisseService };
