import { Request, Response } from "express";
import * as dotenv from "dotenv";
import Data from "../models/data.model";

const fetch = require("node-fetch");
const https = require("https");

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});
dotenv.config();

async function getApiData() {
  const apiUrl =
    "https://efatura.etrsoft.com/fmi/data/v1/databases/testdb/layouts/testdb/records/1 ";
  try {
    const token = await getToken();

    const response = await fetch(apiUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },

      agent: httpsAgent,
      body: '{"fieldData": {},   "script" : "getData"}',
    });

    console.log("Authorization : Bearer " + token);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const parsedData = JSON.parse(data.response.scriptResult);
    console.log("Response data:", parsedData);

    for (const datum of parsedData) {
      const newData = new Data({
        id: datum.id,
        hesap_kodu: datum.hesap_kodu,
        hesap_adi: datum.hesap_adi,
        tipi: datum.tipi,
        ust_hesap_id: datum.ust_hesap_id,
        borc: datum.borc,
        alacak: datum.alacak,
        borc_sistem: datum.borc_sistem,
        alacak_sistem: datum.alacak_sistem,
        alacak_doviz: datum.alacak_doviz,
        borc_islem_doviz: datum.borc_islem_doviz,
        alacak_islem_doviz: datum.alacak_islem_doviz,
        birim_adi: datum.birim_adi,
        bakiye_sekli: datum.bakiye_sekli,
        aktif: datum.aktif,
        dovizkod: datum.dovizkod,
      });

      const filter = { id: datum.id };
      const updateData = {
        $set: {
          hesap_kodu: datum.hesap_kodu,
          hesap_adi: datum.hesap_adi,
          tipi: datum.tipi,
          ust_hesap_id: datum.ust_hesap_id,
          borc: datum.borc,
          alacak: datum.alacak,
          borc_sistem: datum.borc_sistem,
          alacak_sistem: datum.alacak_sistem,
          alacak_doviz: datum.alacak_doviz,
          borc_islem_doviz: datum.borc_islem_doviz,
          alacak_islem_doviz: datum.alacak_islem_doviz,
          birim_adi: datum.birim_adi,
          bakiye_sekli: datum.bakiye_sekli,
          aktif: datum.aktif,
          dovizkod: datum.dovizkod,
        },
      };

      const existingData = await Data.findOneAndUpdate(filter, updateData, { new: true });

      if (!existingData ) {
        await Data.create(newData)
      
      }
    }
  } catch (error) {
    console.error(error);
  }
}

async function getToken() {
  const apiUrl =
    "https://efatura.etrsoft.com/fmi/data/v1/databases/testdb/sessions";
  let token = "";
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + btoa("apitest:test123"),
      },

      agent: httpsAgent,
    });
    console.log("Authorization : Basic " + btoa("apitest:test123"));
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    token = data.response.token;
    console.log("Response data:", data);
  } catch (error) {
    console.error("Error:", error.message);
  }

  return token;
}


export const getAllData = async (req, res) => {
    var answer: any[] = [];
    var wait: any[] = [];
    
    try {
        const things = await Data.find({});
        
        things.filter(v => v.borc !== null).forEach(thing => {
            const n = thing.hesap_kodu?.split(".");
            
            if (n) {
                let i = answer.findIndex(t => t.hesab_no == n[0]);
    
                if (i != -1) {
                    if (n.length == 2) {
                        answer[i].sub_group.push({
                            "hesab_no": thing.hesap_kodu,
                            "borc": thing.borc,
                            "sub_group": []
                        });
                        answer[i].borc += thing.borc;
                    }
                    if (n.length == 3) {
                        let j = answer[i].sub_group.findIndex(t => t.hesab_no == n[0] + "." + n[1]);
                        if (j !== -1) {
                            answer[i].sub_group[j].sub_group.push({
                                "hesab_no": thing.hesap_kodu,
                                "borc": thing.borc
                            });
                        } else {
                            wait.push(thing);
                        }
                    }
                } else if (n.length == 3) {
                    wait.push(thing);
                } else {
                    answer.push({
                        "hesab_no": n[0],
                        "borc": thing.borc,
                        "sub_group": [{
                            "hesab_no": thing.hesap_kodu,
                            "borc": thing.borc,
                            "sub_group": []
                        }]
                    });
                }
            }
        });
    
        wait.forEach(thing => {
            const n = thing.hesap_kodu?.split(".");
            if (n) {
                let i = answer.findIndex(t => t.hesab_no == n[0]);
                let j = answer[i].sub_group.findIndex(t => t.hesab_no == n[0] + "." + n[1]);
                if (j !== -1) {
                    answer[i].sub_group[j].sub_group.push({
                        "hesab_no": thing.hesap_kodu,
                        "borc": thing.borc
                    });
                }
            }
        });
    
        res.status(200).send(answer);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
    
};

export const findHesapNo = async (req, res) => {
  const filter = { id: req.body.ust_hesap_id };
  const veri = await req.find(filter);
  if (veri) {
    res.status(200);
  } else res.status(404);
};

setInterval(getApiData, 10000);
