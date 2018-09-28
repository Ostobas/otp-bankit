// Init the ui library
var ui = ui()

// Languge
var globalLang = ui.getCookieValue('ecoLanguage') || 'en',
    l // The language json from server

// Get the language json file
;(function() {
    var uri = '/lang/landing_page/' + globalLang + '/landing_page_' + globalLang + '.json'
    var xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            l = JSON.parse(this.responseText)
            // We need to invoke these function here, because they rely on the language.json file.
            // Invoke the form validation functionsm (login, signup)
            formValidation()
            // Create the cookie banner
            cookieAgree()
            // Typed text in the page header
            typedText()
        }
    }
    xhttp.open('GET', uri, true)
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    xhttp.send()
})()

function formValidation() {

    // Login form validation
    ui.form('#loginForm', [{
            name: 'email',
            rules: [{
                    type: 'required',
                    message: l.modals.login.email.reqMsg
                },
                {
                    type: 'validEmail',
                    message: l.modals.login.email.validMsg
                }
            ]
        },
        {
            name: 'password',
            rules: [{
                    type: 'required',
                    message: l.modals.login.password.reqMsg
                },
                {
                    type: 'minLength(6)',
                    message: l.modals.login.password.minLengthMsg
                }
            ]
        }
    ], function (results) {
        if (results.valid) {
            // Format the data for server
            var data = {}
            for (var i = 0; i < results.fields.length; i++) {
                data[results.fields[i].name] = results.fields[i].value
            }
            sendData('/api/v1/auth/login.php', data, loginHandler)
        } else {
            document.querySelector('#loginForm .message .title').innerHTML = l.modals.login.msgTitle
        }
    })
    
    // Sign Up form validation
    ui.form('#signUpForm', [{
            name: 'firstname',
            rules: [{
                type: 'required',
                message: l.modals.signup.firstname.reqMsg
            }]
        }, {
            name: 'lastname',
            rules: [{
                type: 'required',
                message: l.modals.signup.lastname.reqMsg
            }]
        }, {
            name: 'email',
            rules: [{
                    type: 'required',
                    message: l.modals.signup.email.reqMsg
                },
                {
                    type: 'validEmail',
                    message: l.modals.signup.email.validMsg
                }
            ]
        }, {
            name: 'password',
            rules: [{
                    type: 'required',
                    message: l.modals.signup.password.reqMsg
                },
                {
                    type: 'minLength(6)',
                    message: l.modals.signup.password.minLengthMsg
                }
            ]
        }, {
            name: 'repassword',
            rules: [{
                    type: 'required',
                    message: l.modals.signup.repassword.reqMsg
                },{
                    type: 'sameAs(password)',
                    message: l.modals.signup.repassword.sameAsMsg
                }
            ]
        }, {
            name: 'privacy',
            rules: [{
                type: 'required',
                message: l.modals.signup.privacy.reqMsg
            }]
        }, {
            name: 'newsletter',
            rules: [{
                type: 'required',
                message: l.modals.signup.newsletter.reqMsg
            }]
        }
    ], function (results) {
        if (results.valid) {
            // Format the data for server
            var data = {}
            for (var i = 0; i < results.fields.length; i++) {
                data[results.fields[i].name] = results.fields[i].value
            }
            sendData('/api/v1/auth/registration.php', data, signUpHandler)
        } else {
            document.querySelector('#signUpForm .message .title').innerHTML = l.modals.login.msgTitle
        }
    })
}

function signUpHandler (res) {
    if (res.isValid) {
        // The login is valid, redirect
        window.location.href = res.redirect
    } else {
        // Login is invalid, show the error message
        ui.buildFormMessage('#signUpForm', [res.msg], 'error')
        document.querySelector('#signUpForm .message .title').innerHTML = l.modals.login.msgTitle
    }
}

function loginHandler (res) {
    if (res.isValid) {
        // The login is valid, redirect
        window.location.href = res.redirect
    } else {
        // Login is invalid, show the error message
        ui.buildFormMessage('#loginForm', [res.msg], 'error')
        document.querySelector('#loginForm .message .title').innerHTML = l.modals.login.msgTitle
    }
}

function sendData (uri, data, callback) {
    var xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            callback(JSON.parse(this.responseText))
        }
    }
    xhttp.open('POST', uri, true)
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    xhttp.send('data=' +  JSON.stringify(data))
}

(function () {
    if ( typeof window.CustomEvent === "function" ) return false;

    function CustomEvent ( event, params ) {
        params = params || { bubbles: true, cancelable: true, detail: undefined };
        var evt = document.createEvent('submit');
        evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
        return evt;
        }

    CustomEvent.prototype = window.Event.prototype;

    window.CustomEvent = CustomEvent;

})();
var evt = new CustomEvent("submit", {"bubbles":true, "cancelable": true})

function cookieAgree() {
    // Checks for cookie banner and create one if needed
    ui.cookieBanner({
        name: 'ecoCookieAgree',
        value: true,
        expire: 7,
        text: l.pageHeader.cookieText,
        btnText: l.pageHeader.cookieBtnText
    })
}

// Fix the nav toggle background
;(function navBGFix() {
    var offset = 150
    var nav = document.querySelector('.nav')
    nav.querySelector('.toggle').addEventListener('click', function() {
        if ((window).pageYOffset < offset) {
            nav.classList.toggle('light')
        }
    })
})()

;(function languageDropdown() {
    // Language dropdown
    var selector = document.querySelector('#langSelect')
    var dropdown = selector.querySelector('.dropdown')
    selector.addEventListener('click', function() {
        toggleDropdown(dropdown)
    })
})()

function toggleDropdown(dropdown) {
    dropdown.classList.toggle('active')
}

function changeLang(language) {
    insertParam('l', language)
}


function insertParam(key, value) {
    // Insert the params in the URL
    key = encodeURI(key)
    value = encodeURI(value)

    var kvp = document.location.search.substr(1).split('&')
    var i = kvp.length, x
    
    while ( i-- ) {
        x = kvp[i].split('=')

        if ( x[0] == key ) {
            x[1] = value
            kvp[i] = x.join('=')
            break
        }
    }

    if ( i < 0 ) {
        kvp[kvp.length] = [key,value].join('=')
    }

    //this will reload the page, it's likely better to store this until finished
    document.location.search = kvp.join('&'); 
}

// Change the Hash to english
;(function () {
    var hash = window.location.hash
    if (!hash) return

    // Other than English
    var supportedLang = ['hu']

    var hashMap = [
        {
            en: '#getStarted',
            hu: '#kezdjneki'
        }, {
            en: '#products',
            hu: '#termekek'
        }, {
            en: '#pricing',
            hu: '#arazas'
        }, {
            en: '#login',
            hu: '#bejelentkezes'
        }, {
            en: '#signup',
            hu: '#regisztracio'
        }
    ]

    for (var i = 0; i < hashMap.length; i++) {
        for (var j = 0; j < supportedLang.length; j++) {
            if (hash === hashMap[i][supportedLang[j]]) {
                window.location.hash = hashMap[i].en
            }
        }
    }

})()

// Modal on link
;(function openModalOnLink() {
    // Check the url hash
    if (window.location.hash === '#login') {
        // Open the modal with UI
        ui.openModal('#loginModal')
    } else if (window.location.hash === '#signup') {
        ui.openModal('#signUpModal')
    } else {
        return
    }
})()

// Change the nav style when the scroll is low enough
function changeNavStyle(nav, offset) {
    // If the collapse is active, don't change the apparence
    var collapse = document.querySelector('.nav .collapse')
    if (collapse.classList.contains('active')) return
    
    if ((window).pageYOffset > offset ) {
        nav.classList.add('light')
        nav.classList.add('small')
    } else {
        nav.classList.remove('light')
        nav.classList.remove('small')
    }
}

;(function () {
    // Change header class on scroll
    var topNav = document.querySelector('#topNav')
    if (topNav) {
        changeNavStyle(topNav, 150)
        window.addEventListener('scroll', function () {
            changeNavStyle(topNav, 150)
        })
    }
})()

// Products sliders on click
function slideProducts(dir) {
    var cardGrid = document.querySelector('#products-cards-grid')
    var cardWidth = cardGrid.querySelector('.card').offsetWidth
    var numbOfCards = document.querySelector('#products').querySelectorAll('.card').length

    //Get the number from the transform: translate property
    var cardGridOffset = -Number(cardGrid.style.transform.match(/\d+/g, '')[0])
    var direction = dir === 'left' ? 1 : -1

    // Translate with the width of a card
    var translateFinal = cardGridOffset + direction * (cardWidth + 10) // +5 cause of margin
    cardGrid.setAttribute('style', 'transform: translateX(' + translateFinal + 'px)')

    // If there is tranlation, show the left arrow. At the far right, hide the right arrow.
    var leftArrow = document.querySelector('#products').querySelector('.arrow-left')
    var rightArrow = document.querySelector('#products').querySelector('.arrow-right')

    if (Math.abs(translateFinal) > 0) {
        leftArrow.classList.add('active')
    } else {
        leftArrow.classList.remove('active')
    }

    if (Math.abs(translateFinal) >= (numbOfCards - 1) * cardWidth) {
        rightArrow.classList.remove('active')
    } else {
        rightArrow.classList.add('active')
    }
}

// Type the text
function typedText() {
    // Declare the words
    var wordArr = [l.pageHeader.typedText1, l.pageHeader.typedText2, l.pageHeader.typedText3, l.pageHeader.typedText4, l.pageHeader.typedText5, l.pageHeader.typedText6, l.pageHeader.typedText7]
    var numbOfWords = wordArr.length

    // Find the div
    var div = document.querySelector('.typed-text')
    // Return if the div is not found
    if (!div) return

    // Init the counter variables
    var currentChar = 0
    var currentWord = 0

    function typing(text) {
        // Check if the typing is finished
        if (currentChar < text.length) {
            // First type a space charakter
            if (currentChar === 0) {
                div.textContent += ' '   
            }

            // Type the current charakter
            div.textContent += text.charAt(currentChar)
            // Set up for the next char
            currentChar++
            // Randomize the typing speed
            var typeSpeed = Math.random() * 70 + 100
            // Recursively call the typing function with thr text parameter
            setTimeout(typing.bind(null, text), typeSpeed)
        } else {
            // The typing is finished, start the delete process
            setTimeout(deleteTyping.bind(null, text), 3000)
        }
    }
    // When the page loads call the typing func for the first time
    setTimeout(typing.bind(null, wordArr[currentWord]), 1000)

    function deleteTyping(text) {
        // Check if any char left in the text
        if (currentChar > 0) {
            // Cut off the last char
            var deletedText = ' ' + text.substring(0, currentChar - 1)
            // Set the div as the deleted version of the text
            div.textContent = deletedText
            currentChar--
            // Call recursively the delete function
            setTimeout(deleteTyping.bind(null, text), 70)
        } else {
            // The delete process is finished, find the next word
            currentWord++
            // If there are no other word, set to first
            currentWord = currentWord % numbOfWords
            // Call the typing function again
            setTimeout(typing.bind(null, wordArr[currentWord]), 1500)
        }
    }
}

//Size the product card
function setProductCardsWidth() {
    var mainGrid = document.querySelector('#products-main-grid')
    var cardGrid = document.querySelector('#products-cards-grid')
    // Return if there are no grids
    if (!mainGrid || !cardGrid) return
    var cards = cardGrid.querySelectorAll('.card')
    var screenWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
    var numbOfCards = cards.length
    var cardFinalWidth

    // In case of mobile
    if (screenWidth < 576) {
        cardFinalWidth = mainGrid.offsetWidth
        // In case of tablet
    } else if (screenWidth < 1024) {
        cardFinalWidth = mainGrid.offsetWidth / 2 - 10 //-10 beacause of the margins
        // In case of laptop
    } else {
        cardFinalWidth = mainGrid.offsetWidth / 3 - 10 //-20 beacause of the margins
    }

    for (var i = 0; i < numbOfCards; i++) {
        //Doing both way because browser compatibility
        cards[i].setAttribute('style', 'width: ' + cardFinalWidth + 'px')
        cards[i].style.width = cardFinalWidth + 'px'
    }
}
// Run the function on window resize event
window.addEventListener("resize", setProductCardsWidth)
// Run when the windows is loaded
window.onload = function () {
    setProductCardsWidth()
}

// Price slider
;(function priceSliderhandler() {
    // Get the players
    var year = document.querySelector('#licenceYear'),
        slider = document.querySelector('#priceSlider'),
        premiumPrice = document.querySelector('#premiumPrice'),
        proPrice = document.querySelector('#proPrice')

    // Return if the divs are not found
    if (!year || !slider || !premiumPrice || !proPrice) return

    // Set up the pricelist
    var premiumPriceList = [
        1990, 1590, 1290, 1090, 990
    ]
    var proPriceList = [
        3990, 3190, 2590, 2190, 1990
    ]

    // Init the values
    setValues()

    // Change value on slider change
    slider.oninput = setValues
    // IE compatibility
    slider.onchange = setValues

    function setValues() {
        year.innerHTML = slider.value
        premiumPrice.innerHTML = premiumPriceList[slider.value - 1].toLocaleString()
        proPrice.innerHTML = proPriceList[slider.value - 1].toLocaleString()
    }

})()

// Build up the reference images
;(function buildRefImages(num) {
    // Find the img grid
    var imgGrid = document.querySelector('#refImgGrid')
    // Return if the grid is not found
    if (!imgGrid) return
    // Set the source
    var src = './img/refs/ref'
    // Extension
    var ext = '.png'
    var img

    // For every image
    for (var i = 0; i < num; i++) {
        // Create a new one
        img = new Image
        // Set the placeholder
        img.src = './img/placeholder-150.jpg'
        // Add data-src, cause of lazy loading
        img.dataset.src = src + (i + 1) + ext
        img.classList.add('lazy')
        img.alt = 'References'
        imgGrid.appendChild(img)
    }
    // Immediatly invoke with 9 images
})(8)

// Lazy loading
document.addEventListener('DOMContentLoaded', function () {
    // Create an arra of imgaes with lazy classes
    var lazyImages = [].slice.call(document.querySelectorAll('img.lazy'))
    var active = false

    // Create the function
    var lazyLoad = function () {
        if (active === false) {
            active = true

            setTimeout(function () {
                lazyImages.forEach(function (lazyImage) {
                    // The imgage is entering the screen
                    if ((lazyImage.getBoundingClientRect().top <= window.innerHeight && lazyImage.getBoundingClientRect().bottom >= 0) && getComputedStyle(lazyImage).display !== 'none') {
                        // Set the src attribute from the data-src
                        lazyImage.src = lazyImage.dataset.src
                        // Remove the class
                        lazyImage.classList.remove('lazy')

                        // Remove the image from the array
                        lazyImages = lazyImages.filter(function (image) {
                            return image !== lazyImage
                        })

                        // Check if the array is empty, then remove the event listeners
                        if (lazyImages.length === 0) {
                            document.removeEventListener('scroll', lazyLoad)
                            window.removeEventListener('resize', lazyLoad)
                            window.removeEventListener('orientationchange', lazyLoad)
                        }
                    }
                })

                active = false
            }, 200)
        }
    }

    // Add the event listeners
    document.addEventListener('scroll', lazyLoad)
    window.addEventListener('resize', lazyLoad)
    window.addEventListener('orientationchange', lazyLoad)
})

// Custom aos
function animateOnScroll() {

    // Create a proper array from the divs with data-aos property
    var selectorArr = [].slice.call(document.querySelectorAll('[data-aos]'))
    // Set the offset, so tha nimatins will start a little bit later
    var offset = 250

    selectorArr.forEach(function(selector) {
        // Find each selector and see if they are on the screen
        if (selector.getBoundingClientRect().top + offset <= window.innerHeight && selector.getBoundingClientRect().bottom >= 0) {
            // Animate
            selector.classList.add('animate')
            
            setTimeout(function() {
                // Remove the data attribute and animate class, no longer needed
                selector.removeAttribute('data-aos')
                selector.classList.remove('animate')
                
                // Filter the array, remove the current selector element
                selectorArr = selectorArr.filter(function(item) {
                    return item !== selector
                })

                // If the array is empty remove the event listener
                if (selectorArr.length === 0) {
                    document.removeEventListener('scroll', animateOnScroll)
                }
            }, 300)
        }
    })
}
// Invoke the function when the script loads
animateOnScroll()
// Add the event listener to the scroll event
document.addEventListener('scroll', animateOnScroll)