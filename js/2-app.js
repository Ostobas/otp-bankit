// Init the ui library
var ui = ui()

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

function toggleDropdown(dropdown) {
    dropdown.classList.toggle('active')
}

// Build up the partner images
;(function buildRefImages(num) {
    // Find the img grid
    var imgGrid = document.querySelector('#partnerImgGrid')
    // Return if the grid is not found
    if (!imgGrid) return
    // Set the source
    var src = './img/partners/partner-'
    // Extension
    var ext = '.png'
    var img

    // For every image
    for (var i = 0; i < num; i++) {
        // Create a new one
        img = new Image
        // Set the placeholder
        img.src = './img/placeholder-75.jpg'
        // Add data-src, cause of lazy loading
        img.dataset.src = src + (i + 1) + ext
        img.classList.add('lazy')
        img.alt = 'Partner'
        imgGrid.appendChild(img)
    }
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