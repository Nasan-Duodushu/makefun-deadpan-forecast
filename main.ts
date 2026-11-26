// Deadpan Forecasts for Cities That Do Not Exist — entry program.
// Writes one forecast (<=160 chars) to /output/entry.txt: an overnight
// freeze in Port Slumber, where the sea freezes in alphabetical order.
// The absurdity is bureaucratic, not meteorological: a real broadcast line
// (temperature, place, sequence) carrying one impossible rule, delivered
// deadpan. The modal field leans on rain falling sideways or upwards —
// this forecast freezes the sea instead, and never mentions rain.
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

class Forecast {
  private readonly line: string;

  constructor(line: string) {
    this.line = line.trim();
    this.validate();
  }

  get length(): number {
    return this.line.length;
  }

  private validate(): void {
    if (this.line.length === 0 || this.line.length > 160) {
      throw new Error("forecast fails the 1-160 character gate");
    }
    if (this.line.includes("\n")) {
      throw new Error("forecast must be a single line");
    }
    // Broadcast-fit: a named invented city, a temperature, and a concrete
    // sequence — the line must read like a forecaster saying it aloud.
    if (!/Port Slumber/.test(this.line) || !/minus 2/.test(this.line)) {
      throw new Error("forecast must name the city and the temperature");
    }
    if (!/alphabetical order/.test(this.line)) {
      throw new Error("forecast must keep its one absurd rule");
    }
    // The punch must land last: the line has to end on the concrete detail
    // (the harbour), not trail off after the rule.
    if (!/harbour\.$/.test(this.line)) {
      throw new Error("forecast must end on its concrete detail");
    }
    // Modal guard: the field leans on rain falling sideways or upwards.
    if (/rain/i.test(this.line)) {
      throw new Error("forecast must avoid the sideways-rain modal take");
    }
  }

  publish(outDir: string): string {
    mkdirSync(resolve(outDir), { recursive: true });
    const target = resolve(outDir, "entry.txt");
    writeFileSync(target, this.line, "utf8");
    return target;
  }
}

const forecast = new Forecast(
  "Overnight in Port Slumber, temperatures fall to minus 2. The sea will freeze in alphabetical order, starting with the harbour.",
);
const target = forecast.publish(process.env.MAKEFUN_OUTPUT_DIR ?? "/output");
console.log(`wrote ${forecast.length} chars to ${target}`);
