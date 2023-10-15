import { describe, expect, test } from "vitest";

import { simplePluralise } from "./simplePluralise";

describe("simplePluralise", () => {
  test("pluralise word", () => {
    const output = simplePluralise("word", 2);
    expect(output).toEqual("words");
  });
  test("singular word", () => {
    const output = simplePluralise("word", 1);
    expect(output).toEqual("word");
  });
});
