
function normaliseUnits(element, to, multiplier = 10) {
  var a = parseFloat(element.querySelectorAll("[class^=styled__StyledFootnote]")[0].innerText.split('£')[1].split('/')[0])
  element.querySelectorAll("[class^=styled__StyledFootnote]")[0].innerText = '£' + (a * multiplier).toFixed(2).toString() + to
}

if (typeof array != "undefined") {
  array = undefined;
}
if (typeof pricePerWeightElements != "undefined") {
  pricePerWeightElements = undefined;
}
array = []

// Get all product list items including parent nodes (document.getElementsByClassName(product-list--list-item) only gets the parent list items, not the children including price by weight)

pricePerWeightElements = document.getElementsByClassName('product-list--list-item')

// Only sort in-stock elements (out of stock elements do not have prices listed)
for (let i = 0; i < pricePerWeightElements.length; i++) {
  if (
    pricePerWeightElements[i].querySelectorAll("[class^=styled__StyledFootnote]").length > 0 &&
    pricePerWeightElements[i].querySelectorAll("[class^=styled__StyledFootnote]")[0].innerText.includes('£')
  ) {
    array.push(pricePerWeightElements[i]);
  }
}

// Convert prices per 100g to per kg and per 100ml to per litre
for (let j = 0; j < array.length; j++) {
  if (array[j].querySelectorAll("[class^=styled__StyledFootnote]")[0].innerText.includes('100g')) {
    normaliseUnits(array[j], '/kg')
  }
  if (array[j].querySelectorAll("[class^=styled__StyledFootnote]")[0].innerText.includes('10g')) {
    normaliseUnits(array[j], '/kg', 100)
  }
  if (array[j].querySelectorAll("[class^=styled__StyledFootnote]")[0].innerText.includes('100ml')) {
    normaliseUnits(array[j], '/l')
  }
  if (array[j].querySelectorAll("[class^=styled__StyledFootnote]")[0].innerText.includes('10ml')) {
    normaliseUnits(array[j], '/l', 100)
  }
  if (array[j].querySelectorAll("[class^=styled__StyledFootnote]")[0].innerText.includes('75cl')) {
    normaliseUnits(array[j], '/l', 1.33333)
  }
  continue
}

for (let j = 0; j < array.length; j++) {
  // If item contains a Clubcard price and that is just a straight £ value
  if (array[j].querySelectorAll("[class^=offer-text]").length > 0 && array[j].querySelectorAll("[class^=offer-text]")[0].innerText.startsWith("£")) {
    // // Insert Clubcard price by weight
    originalPriceByWeightWithUnit = array[j].querySelectorAll("[class$=beans-price__subtext]")[0].innerText.split('£')[1].split('/')
    originalPriceByWeight = originalPriceByWeightWithUnit[0]
    unit = originalPriceByWeightWithUnit[1]

    originalPrice = array[j].querySelectorAll("[class^=styled__StyledHeading]")[0].innerText.split('£')[1]
    clubcardPrice = array[j].querySelectorAll("[class^=offer-text]")[0].innerText.split('£')[1].split(' Clubcard Price')[0]

    clubcardPriceByWeightNumber = (originalPriceByWeight / originalPrice) * clubcardPrice
    clubcardPriceByWeight = `, £${clubcardPriceByWeightNumber.toFixed(2)}/${unit}`

    clubcardOfferTextContainer = array[j].querySelectorAll("[class^=offer-text]")[0]
    clubcardOfferTextContainer.innerText = clubcardOfferTextContainer.innerText + clubcardPriceByWeight
  }
}

// Sort array from lowest price/kg to highest price/kg - using Clubcard price by weight if present
array.sort(
  function (a, b) {
    aPrice = 0
    bPrice = 0

    if (a.querySelectorAll("[class^=offer-text]").length > 0 && a.querySelectorAll("[class^=offer-text]")[0].innerText.startsWith("£")) {
      originalPriceByWeight = a.querySelectorAll("[class$=beans-price__subtext]")[0].innerText.split('£')[1].split('/')[0]
      originalPrice = a.querySelectorAll("[class^=styled__StyledHeading]")[0].innerText.split('£')[1]
      clubcardPrice = a.querySelectorAll("[class^=offer-text]")[0].innerText.split('£')[1].split(' Clubcard Price')[0]
      aPrice = (originalPriceByWeight / originalPrice) * clubcardPrice
    } else {
      aPrice = parseFloat(a.querySelectorAll("[class^=styled__StyledFootnote]")[0].innerText.split('£')[1].split('/')[0])
    }

    if (b.querySelectorAll("[class^=offer-text]").length > 0 && b.querySelectorAll("[class^=offer-text]")[0].innerText.startsWith("£")) {
      originalPriceByWeight = b.querySelectorAll("[class$=beans-price__subtext]")[0].innerText.split('£')[1].split('/')[0]
      originalPrice = b.querySelectorAll("[class^=styled__StyledHeading]")[0].innerText.split('£')[1]
      clubcardPrice = b.querySelectorAll("[class^=offer-text]")[0].innerText.split('£')[1].split(' Clubcard Price')[0]
      bPrice = (originalPriceByWeight / originalPrice) * clubcardPrice
    } else {
      bPrice = parseFloat(b.querySelectorAll("[class^=styled__StyledFootnote]")[0].innerText.split('£')[1].split('/')[0])
    }
    return aPrice - bPrice
  }
)

// Replace the list in the DOM with your sorted list
for (var k = 0; k < array.length; k++) {
  // As you go between pages, more product lists are added to it. So we only want to modify the one for the page we are on.
  // If we reached the second page without clicking through from the first, only the second page's items will be in the DOM.
  (
    document.getElementsByClassName('list-page-' + window.location.search.split('page=')[1])[0]?.children[0] ||
    document.getElementsByClassName('product-list')[parseInt(window.location.search.split('page=')[1]) - 1] ||
    document.getElementsByClassName('product-list')[0]
  ).appendChild(array[k])
}
