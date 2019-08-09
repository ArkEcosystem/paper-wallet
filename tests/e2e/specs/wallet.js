import fixture from "../../__fixtures__/identity.json";

describe("Wallet - From Entropy", () => {
    it("should generate a wallet", () => {
        cy.visit("/");
        cy.contains("a", "Create a new wallet");
        cy.contains("Create a new wallet").click();
        cy.url().should("eq", "http://localhost:8080/#/wallet/entropy");
        cy.wait(5000);
        cy.url().should("eq", "http://localhost:8080/#/wallet");

        cy.get("#w-address").should($lis => expect($lis.text()).to.have.length(34));
        cy.get("#w-entropy").should($lis => expect($lis.text()).to.have.length(32));
        cy.get("#w-publicKey").should($lis => expect($lis.text()).to.have.length(66));
        cy.get("#w-wif").should($lis => expect($lis.text()).to.have.length(52));
    });
});

describe("Wallet - From Passphrase", () => {
    it("should fail if no passphrase is given", () => {
        cy.visit("/");
        cy.contains("a", "Enter a secret passphrase");
        cy.contains("Enter a secret passphrase").click();
        cy.url().should("eq", "http://localhost:8080/#/wallet/passphrase");

        cy.contains("button", "Generate").click();

        cy.contains("div", "Please fill out the passphrase.");
    });

    it("should generate a wallet (bip39)", () => {
        cy.visit("/");
        cy.contains("a", "Enter a secret passphrase");
        cy.contains("Enter a secret passphrase").click();
        cy.url().should("eq", "http://localhost:8080/#/wallet/passphrase");

        cy.get("#wallet-passphrase").type(
            "size another stool celery ball secret burden giant alter gravity jacket brief",
        );
        cy.contains("button", "Generate").click();

        cy.url().should("eq", "http://localhost:8080/#/wallet");

        cy.contains("span", "AUc8f2A1gn33a7zbubTym55u2ERHc8tt9k");
        cy.contains("span", "c9e1335992811f8507a30d076cc1dc0d");
        cy.contains("span", "039387c299adb4c9f7ba532934d3e210eb21d374cb285926d3d49c8c71e18bc4de");
        cy.contains("span", "SBic9QRyBxVw5xeacLocLiULN6NYy9o93tmizq2WcESgJM4EzyvK");
    });

    it("should generate a wallet (no bip39)", () => {
        cy.visit("/");
        cy.contains("a", "Enter a secret passphrase");
        cy.contains("Enter a secret passphrase").click();
        cy.url().should("eq", "http://localhost:8080/#/wallet/passphrase");

        cy.get("#wallet-passphrase").type(fixture.passphrase);
        cy.contains("button", "Generate").click();

        cy.contains("div", "The passphrase does not appear to be BIP39");
        cy.contains("button", "Generate Anyway").click();

        cy.url().should("eq", "http://localhost:8080/#/wallet");

        cy.contains("span", fixture.data.address);
        cy.contains("span", fixture.data.publicKey);
        cy.contains("span", fixture.data.wif);
    });
});
