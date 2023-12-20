/* vidplaykeyservice..js
 * @GhostKNA
 */
const { route } = require("../routes");
const express = require("express");
const router = express.Router();

// Cambia esto
// const { webcrack } = require("webcrack");
// A estoremove vidkey

//instalar webcrack deobfuscator


module.exports = async (req, res) => {
    

    (async () => {
        const { webcrack } = await import("webcrack");
    
        const { Deobfuscator } = require("deobfuscator");
        const { writeFile } = require("node:fs/promises");
        const { assert } = require("node:console");
        //const { createClient } = require("@supabase/supabase-js");
        const dotenv = require("dotenv");
        dotenv.config();
    
   

    //const supabaseUrl = process.env.SUPABASE_URL;
    //const supabaseKey = process.env.SUPABASE_KEY;
    //console.log(supabaseUrl);
    //console.log(supabaseKey);
    //const supabase = createClient(supabaseUrl, supabaseKey)


    async function deobfuscationLoop(obfuscatedInput, loopFunction) {
        let deobfuscated = obfuscatedInput
        for (let run = 0; run < 5; run++) {
            try {
                const result = await loopFunction(deobfuscated)
                if (result == "" || result == undefined) break
                deobfuscated = result
            } catch (e) {
                console.error(e)
                break
            }
        }
        return deobfuscated
    }

    async function deobfuscationChain(obfuscatedScript, deobfsSteps) {
        let deobfs = obfuscatedScript
        for (const func of deobfsSteps) {
            deobfs = await deobfuscationLoop(deobfs, func)
        }
        return deobfs
    }

    const synchrony = new Deobfuscator()
    const webcrackStep = async (x) => await webcrack(x).code
    const synchronyStep = async (x) => await synchrony.deobfuscateSource(x)
    const checkDeobfs = (x) => x.indexOf("<video />") !== -1

    async function getDeobfuscatedScript() {
        const vidplayHost = "https://vidplay.lol"
        const headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; rv:109.0) Gecko/20100101 Firefox/120.0",
            "Referer": vidplayHost + "/e/",
            "Origin": vidplayHost
        }

        const vidplayHtml = await fetch(`${vidplayHost}/e/`, { headers: headers }).then(async (x) => await x.text())

        const codeVersion = vidplayHtml.match(/embed.js\?v=(\w+)/)[1]
        console.log("codeVersion", codeVersion);
        const scriptUrl = `${vidplayHost}/assets/mcloud/min/embed.js?v=${codeVersion}`

        const obfuscatedScript = await fetch(scriptUrl, { headers: headers }).then(async (x) => await x.text())

        //console.log("obfuscatedScript", obfuscatedScript);

        const firstTry = await deobfuscationChain(obfuscatedScript, [webcrackStep, synchronyStep])
        //console.log("firstTry", firstTry);
        if (checkDeobfs(firstTry)) return firstTry

        const secondTry = await deobfuscationChain(obfuscatedScript, [synchronyStep])
       // console.log("firsecondTrystTry", secondTry);
        return secondTry
    }

    const deobfuscated = await getDeobfuscatedScript()

    // Phase 4: Let's find the keys!
    if (checkDeobfs(deobfuscated)) {
        const start = deobfuscated.substring(deobfuscated.indexOf("<video />"))
       // console.log("start", start);
        const end = start.substring(0, start.indexOf(".replace"))
        console.log("end", end);
        const keys = Array.from(end.matchAll(/'(\w+)'/g), x => x[1])
        console.log("keys", keys);
        assert(keys.length == 2, "Invalid array length!")

        // Be happy!
        console.info("Success!")
        console.info("keys.json", JSON.stringify(keys), "utf8")
        async function insertarEnBaseDeDatos() {
            const insertData = {
                id: "VidPlay",
                keys: JSON.stringify(keys),
            };
            try {
               // await supabase.from("keys").delete().eq('id', 'VidPlay');
              //  console.log("Data delete into Supabase successfully.");
              //  await supabase.from("keys").insert(insertData);
              //  console.log("Data inserted into Supabase successfully.");
            } catch (error) {
                console.error("Error inserting data into Supabase:", error);
            }
        }
        //await insertarEnBaseDeDatos();
        await writeFile("keys.json", JSON.stringify(keys), "utf8")
        res.status(200).json({ success: true, keys: keys });

    } else {
        // ... Or not xD
        console.error("FAIL!")
        await writeFile("failed.js", deobfuscated, "utf8")
        res.status(200).json({ success: false, message: "Failed to deobfuscate" });
    }

})();

};


