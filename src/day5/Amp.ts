import {parseInstruction} from "../day7/int-code";
import {Observable, Subject, zip} from "rxjs";

export class Amp {
    private index: number;
    private intCommands: Array<number>;
    private name: string;
    private commandLength = 4;
    private debug: boolean;
    private input$: Observable<number>;
    private output: Subject<number> = new Subject<number>();
    private ended: boolean;
    private waiting: Subject<boolean> = new Subject<boolean>();
    private waiting$: Observable<boolean> = this.waiting.asObservable();


    constructor(name: string, intCommands: Array<number>, input$: Observable<number>, debug = false) {
        this.name = name;
        this.intCommands = intCommands;
        this.input$ = input$;
        this.debug = debug;
        this.ended = false;

        this.init();
    }

    init() {
        zip(
            this.waiting$,
            this.input$,
        ).subscribe(([waiting, value]) => {
            if (waiting) {
                this.readNext(value);
            }
        })
    }

    readNext(input: number) {
        let opcode = 1;
        while (!this.ended && this.index < this.intCommands.length && opcode != 3) {

            const {
                opcode: newOpcode,
                operation,
                jump,
                length: newLength,
                modes,
            } = parseInstruction(this.intCommands[this.index]);
            this.commandLength = newLength;
            opcode = newOpcode;

            const input1 = modes[2]
                ? this.intCommands[this.index + 1]
                : this.intCommands[this.intCommands[this.index + 1]];
            const input2 = modes[1]
                ? this.intCommands[this.index + 2]
                : this.intCommands[this.intCommands[this.index + 2]];
            const position = this.commandLength == 2
                ? modes[2]
                    ? this.index + 1
                    : this.intCommands[this.index + 1]
                : modes[0]
                    ? this.index + 3
                    : this.intCommands[this.index + 3];
            if (this.debug) {
                console.debug({
                    index: this.index,
                    opcode,
                    input1,
                    input2,
                    position,
                    modes,
                });
            }

            let doTheJump = false;
            switch (opcode) {
                case 1:
                case 2:
                case 7:
                case 8:
                    this.intCommands[position] = operation(input1, input2);
                    break;
                case 3:
                    this.waiting.next(true);
                    continue;
                // this.intCommands[position] = operation(input);
                // break;
                case 4:
                    this.output.next(operation(input1));
                    break;
                case 5:
                case 6:
                    doTheJump = jump(input1);
                    break;
                case 99:
                    this.ended = true;
                    break;
                default:
                // nothing
            }

            // for the next loop
            if (doTheJump) {
                this.index = input2;
            } else {
                this.index += this.commandLength;
            }
            if (this.debug) {
                console.debug(this.intCommands);
            }
        }
    }

    getOutput$() {
        return this.output.asObservable();
    }
}