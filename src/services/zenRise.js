export const getCardToken = async (card) => {

    const zenrise = new window.Zenrise.Sdk('DEV');
    const token = await zenrise.getCardToken({
        card_number: card.number,
        card_expiration_month: card.expiry.slice(0, 2),
        card_expiration_year: card.expiry.slice(3, 5),
        security_code: card.cvc,
        card_holder_name: card.name,
        card_holder_identification: {
            type: 'DNI',
            number: card.dni
        }
    })

    return token

}

export const getAuthToken = async () => {
    const response = await fetch("https://dev.api.zenrise.io/v1/users/api-login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            clientId: "010ae77f234713bc66c6c8294989630f.zen.api.client",
            secretId: "E957Cd66D0C27e2F63e6e9325b05f79096afd22b62b52a0e1d7dd84f4784f811"
        })
    })
    const token = await response.json()
    return token.Authorization

}

export const getSplitToken = async (amount, partnersFee, contact, authToken) => {
    const response = await fetch("https://dev.api.zenrise.io/v1/requests/simple/split", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`
        },
        body: JSON.stringify(
            {
                "amount": amount,
                "contact": {
                    "email": "comprador@mail.com",
                    "firstName": "nombreComprador",
                    "lastName": "Apellido comprador",
                },
                "description": "string",
                "externalReference": "string",
                "firstDueDate": "2020-06-25",
                "percentageAfterFirstDueDate": 0,
                "percentageAfterSecondDueDate": 0,
                "secondDueDate": "2020-06-25",
                "sendPerEmail": false,
                "partnersFee": [
                    {
                        "organizationHash": "mexRwe3zw5",
                        "feeAmount": 200
                    }
                ]
            }
        )
    })
    const dataToParse = await response.json()
    const cardSplitToken = dataToParse.checkoutLink.split('=')[1]
    return cardSplitToken
}


export const cardPayment = async (card, amount, partnersFee, contact) => {

    // Get JWT auth token
    const authToken = await getAuthToken()
    
    // Get split card transaction Token
    const splitToken = await getSplitToken(amount, partnersFee, contact, authToken)

    // GET card encrypted card
    const encryptedCard = await getCardToken(card)

    const response = await fetch("https://dev.api.zenrise.io/v1/card-transaction", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`
        },
        body: JSON.stringify({
            "token": encryptedCard.token,
            "bin": encryptedCard.bin,
            "lastFourDigits": encryptedCard.lastFourDigits,
            "cardTransactionRequestId": splitToken,
            "paymentType": 1,
            "payerDocumentNumber": card.dni,
            "payerCardHolder": card.name,
            "payerEmail": "bacigalupotomas@gmail.com"
        })
    })

    return  await response.json()
}