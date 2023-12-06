import mongoose from "mongoose";

const Schema = mongoose.Schema;

const dataschema = new Schema({
 
  id: { type: Number },
  hesap_kodu: { type: String },
  hesap_adi :{ type: String },
  tipi:{ type: String },
  ust_hesap_id :{ type: Number },
  borc :{ type: Number },
  alacak:{ type: Number },
  borc_sistem:{ type: Number },
  alacak_sistem:{ type: Number },
  alacak_doviz:{ type: Number },
  borc_islem_doviz:{ type: Number },
  alacak_islem_doviz:{ type: Number },
  birim_adi:{ type: String },
  bakiye_sekli:{ type: Number },
  aktif:{ type: Number },
  dovizkod:{ type: Number },
});

const Data = mongoose.model("User", dataschema);

export default Data;
