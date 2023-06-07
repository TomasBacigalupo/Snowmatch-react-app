const SNOWMATCH_CLIENT = ""
const SNOWMATCH_SECRET = ""
const api = process.env.REACT_APP_ZENRISE_API

export const getCardToken = async (card) => {

    const zenrise = new window.Zenrise.Sdk(process.env.REACT_APP_ZENRISE_ENCRYPTION_ENV);
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

export const getCardEncryptedCard = async (card) => {

    const zenrise = new window.Zenrise.Sdk('PROD');
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

export const getAuthToken = async (client, secret) => {
    const response = await fetch(`${api}/users/api-login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            clientId: client,
            secretId: secret
        })
    })
    const token = await response.json()
    return token.Authorization

}

export const getSplitToken = async (amount, partnersFee, contact, authToken) => {
    const response = await fetch(api, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`
        },
        body: JSON.stringify(
            {
                "amount": amount,
                "contact": {
                    "email": contact.email,
                    "firstName": contact.name,
                    "lastName": contact.lastName,
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
                        "organizationHash": "Kwxzm9Wz0j",
                        "feeAmount": amount * partnersFee
                    }
                ]
            }
        )
    })
    const dataToParse = await response.json()
    const cardSplitToken = dataToParse.checkoutLink.split('=')[1]
    return cardSplitToken
}


export const cardPayment = async (client = SNOWMATCH_CLIENT, secret = SNOWMATCH_SECRET, card, amount, partnersFee, contact) => {

    // Get JWT auth token
    const authToken = await getAuthToken(client, secret)
    
    // Get split card transaction Token
    const splitToken = await getSplitToken(amount, partnersFee, contact, authToken)

    // GET card encrypted card
    const encryptedCard = await getCardToken(card)

    const response = await fetch("https://api.zenrise.io/v1/card-transaction", {
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