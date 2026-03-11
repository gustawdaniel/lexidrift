import {CheckCorrectnessSelector, WordRecord, WordWithCorrectnessChecked} from "./io.port";

export interface WordAdapter {
    update(selector: CheckCorrectnessSelector, update: Partial<WordWithCorrectnessChecked>): Promise<void>;
    find(request: CheckCorrectnessSelector): Promise<WordRecord | WordWithCorrectnessChecked | null>;
}