/* tslint:disable:variable-name */
/* tslint:disable:no-var-requires */
/* tslint:disable:no-use-before-defined */
/**
 *
 * if you want to modify the code of this file, please pay
 * attention to the usage of `this` in this file, they are
 * all support for api.
 *
 */
const chalk = require("chalk");

import { abi } from "./json/abi.json";
import { bufferToU8a, u8aToHex } from "@polkadot/util";
import { rlp } from "ethereumjs-util";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";

enum Logger {
    Error,
    Event,
    EventMsg,
    Info,
    Success,
    Warn,
}

/**
 * build the burn contract in darwinia
 */
function burn(web3: any, addr: any): any {
    return new web3.eth.Contract(abi, "0xb52FBE2B925ab79a821b261C82c5Ba0814AAA5e0")
        .methods.transferFrom(
            addr,
            "0xdBC888D701167Cbfb86486C516AafBeFC3A4de6e",
            "1000000000000000000",
            "0x2ad7b504ddbe25a05647312daa8d0bbbafba360686241b7e193ca90f9b01f95faa",
        );
}

/**
 * simple logger
 */
async function log(s: any, logger?: Logger) {
    const l = chalk.dim("[ ");
    const r = chalk.dim(" ]:");

    switch (logger) {
        case Logger.Error:
            console.error(`${l + chalk.red("error") + r} ${s}`);
            process.exit(1);
        case Logger.Event:
            await parseRes.call(this, s);
            break;
        case Logger.EventMsg:
            console.log(`${l + chalk.magenta("event") + r} ${s}`);
            break;
        case Logger.Success:
            console.log(`${l + chalk.green("success") + r} ${s}`);
            break;
        case Logger.Warn:
            console.log(`${l + chalk.yellow("warn") + r} ${s}`);
            break;
        default:
            console.log(chalk.dim(`[ ${chalk.cyan.dim("info")} ]: ${s}`));
            break;
    }
}


/**
 * simple logger
 */
async function parseRes(r: any) {
    const status = r.status;
    log(`Transaction status: ${status.type}`);

    if (status.isInBlock) {
        log(`Included at block hash: ${status.asInBlock.toHex()}`);
        r.events && r.events.forEach(async (r: any) => {
            log(
                "\t" +
                r.phase.toString() +
                `: ${r.event.section}.${r.event.method}` +
                r.event.data.toString(),
            );

            if (r.event.data[0].isModule) {
                const doc = await this.api.registry.findMetaError(r.event.data[0].asModule);
                const err = `${doc.name}.${doc.section} - ${doc.documentation.join(" ")}`;
                log(err, Logger.Error);
            }
        });
    } else if (status.isFinalized) {
        log(`Finalized block hash: ${status.asFinalized.toHex()}`);
        this.queue.active = false;
    }
}

/**
 * parse absolute path for storage, ref to the `root` in cofig
 */
function storePath(s: string): string {
    s = s.replace("~", os.homedir());
    const dirName = path.dirname(s);
    if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName, { recursive: true });
    }

    log(`your storage path is ${s}`);

    return s;
}


/**
 * parse eth header to darwinia-eth header
 */
function parseHeader(block: any): any {
    const mixh = bufferToU8a(rlp.encode(block.mixHash));
    const nonce = bufferToU8a(rlp.encode(block.nonce));
    const seal = [u8aToHex(mixh), u8aToHex(nonce)];

    return {
        parent_hash: block.parentHash,
        timestamp: block.timestamp,
        number: block.number,
        auth: block.miner,
        transaction_root: block.transactionsRoot,
        uncles_hash: block.sha3Uncles,
        extra_data: block.extraData,
        state_root: block.stateRoot,
        receipts_root: block.receiptsRoot,
        log_bloom: block.logsBloom,
        gas_used: block.gasUsed,
        gas_limit: block.gasLimit,
        difficulty: block.difficulty,
        seal,
        hash: block.hash
    };
}

export {
    burn,
    Logger,
    log,
    parseRes,
    storePath,
    parseHeader,
}
