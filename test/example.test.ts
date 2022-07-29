import { expect } from "chai";

describe("Example", () => {
  it("should be able to be true", () => {
    //Given
    let boolean;

    //When
    boolean = true;

    //Then
    expect(boolean).to.be.true;
  });
});
