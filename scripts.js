/**
 * Data Catalog Project Starter Code - SEA Stage 2
 *
 * This file is where you should be doing most of your work. You should
 * also make changes to the HTML and CSS files, but we want you to prioritize
 * demonstrating your understanding of data structures, and you'll do that
 * with the JavaScript code you write in this file.
 *
 * The comments in this file are only to help you learn how the starter code
 * works. The instructions for the project are in the README. That said, here
 * are the three things you should do first to learn about the starter code:
 * - 1 - Change something small in index.html or style.css, then reload your
 *    browser and make sure you can see that change.
 * - 2 - On your browser, right click anywhere on the page and select
 *    "Inspect" to open the browser developer tools. Then, go to the "console"
 *    tab in the new window that opened up. This console is where you will see
 *    JavaScript errors and logs, which is extremely helpful for debugging.
 *    (These instructions assume you're using Chrome, opening developer tools
 *    may be different on other browsers. We suggest using Chrome.)
 * - 3 - Add another string to the titles array a few lines down. Reload your
 *    browser and observe what happens. You should see a fourth "card" appear
 *    with the string you added to the array, but a broken image.
 *
 */
let data;
let currentPage = 1;
const itemsPerPage = 9;
let filteredData;




// Fetch the JSON data and call the function to display the images
fetch('./image_data.json')
    .then(response => response.json())
    .then(json => {
        data = json;

        // By default load original theme
        filteredData = data.filter(function (image)// if image theme = selected theme, put it into filtered data
        {
            return image.theme === 'Originals';
        });
        displayImages();
    })
    .catch(error => console.error('Error:', error));



// Pagination and Display Functions

// CALCULATE TOTAL PAGES
function calculateTotalPages(){
    return Math.ceil(filteredData.length / itemsPerPage); // Total pages according to filtered data
}



// DISPLAY PAGE NUMBERS
// DISPLAY PAGE NUMBERS
function updatePageNumbers(){
    const totalPages = calculateTotalPages();
    const pageNumbersDiv = document.getElementById('page-numbers');
    pageNumbersDiv.innerHTML = '';

    for (let i = 1; i <= totalPages; i++)
    {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            const pageNumber = document.createElement('span');
            pageNumber.textContent = i;
            pageNumber.classList.add('page-number');
            if (i === currentPage) {
                pageNumber.classList.add('current-page');
            }

            pageNumber.addEventListener('click', function() {
                currentPage = i;
                displayImages();
            });

            pageNumbersDiv.appendChild(pageNumber);

        } else if (i === currentPage - 3 || i === currentPage + 3) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.classList.add('ellipsis');
            pageNumbersDiv.appendChild(ellipsis);
        }
    }
}


// DISPLAY IMAGES
function displayImages() {
    const gallery = document.getElementById('image-container');
    gallery.innerHTML = ''; // Clear the pages images before putting new ones in

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;


    filteredData.slice(start, end).forEach(image => {
        const img = document.createElement('img');
        img.src = `./images/banksy/${image.filename}`;
        gallery.appendChild(img);



        const title = document.createElement('p'); // Create paragraph element
        title.textContent = image.title + ' (' + image.year + ') ';

        const div = document.createElement('div'); // Create div to hold img and title
        div.appendChild(img); // Add img to div
        div.appendChild(title); // Add title to div

        gallery.appendChild(div); // Add the div to the gallery


        // Select all images
        const images = document.querySelectorAll('#image-container img');

        let enlargedImage = null; // Variable to keep track of the currently enlarged image

// Add click event listener to each image
        images.forEach(img => {
            img.addEventListener('click', function(event) {
                // Prevent the document's click event from firing
                event.stopPropagation();

                // Change opacity
                this.style.opacity = '1';
                // If an image is already enlarged, revert it back to its original size
                if (enlargedImage) {
                    enlargedImage.style.width = '300px';
                    enlargedImage.style.height = '300px';
                    enlargedImage.style.zIndex = 0;
                    enlargedImage.classList.remove('enlarged');
                }

                // Resize the image to its natural size
                this.style.width = this.naturalWidth + 'px';
                this.style.height = this.naturalHeight + 'px';

                // Bring the image to the front
                this.style.zIndex = 1;

                // Add a class to indicate that the image is enlarged
                this.classList.add('enlarged');

                // Update the currently enlarged image
                enlargedImage = this;
            });
        });

// Add click event listener to the document body
        document.body.addEventListener('click', function() {
            // If an image is enlarged, resize it back to its original size
            if (enlargedImage) {
                enlargedImage.style.width = '300px';
                enlargedImage.style.height = '300px';
                enlargedImage.style.zIndex = 0;
                enlargedImage.classList.remove('enlarged');
                enlargedImage = null; // Reset the currently enlarged image
            }
        });

    });

    updatePageNumbers()
}







// Pages functions
function nextPage() {
    if (currentPage < calculateTotalPages())
    {
        currentPage++;
        displayImages()
    }
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        displayImages()
    }
}



// EVENT LISTENERS

// Event listener for next and previous buttons
document.getElementById('next-button').addEventListener('click', nextPage);
document.getElementById('prev-button').addEventListener('click', previousPage);



// Select all items in the navigation bar
const navItems = document.querySelectorAll('.secondNav a');

// Hide all pages
const pages = document.querySelectorAll('.page');
pages.forEach(page => {
    page.style.display = 'none';
});

// Show the "about-banksy" section by default
document.querySelector('#about-banksy').style.display = 'block';

navItems.forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();

        // Hide all pages
        pages.forEach(page => {
            page.style.display = 'none';
        });

        // Show the corresponding page
        const pageId = this.getAttribute('href').substring(1); // Get the id from the href attribute of the clicked item
        const page = document.querySelector('#' + pageId);
        if (page) {
            page.style.display = 'block';
        }
    });
});




// Sorting and filtering functions

// THEME SORTING


// Recent & Oldest

$('#Topics').on('change', function() {
    let selectedThemes = $(this).val(); // Turn selected themes into array

    //Reset current paages and update page number
    currentPage = 1;
    updatePageNumbers();

    // Filter data based on selected themes
    filteredData = data.filter(function(image)
    {
        return selectedThemes.includes(image.theme); // if image.theme = selected.themes return true
    });
    displayImages();
});

$('#sort-by').on('change', function(){
    let selectedOptions = $(this).val(); // Turn selected sorting into array

    currentPage = 1;
    updatePageNumbers();

    // Sort data based on selected options
    if (selectedOptions.includes('recent')) {
        filteredData.sort(function(a, b){
            return b.year - a.year;
        });
    }
    if (selectedOptions.includes('oldest')) {
        filteredData.sort(function(a, b){
            return a.year - b.year;
        });
    }
    if (selectedOptions.includes('alpha')) {
        filteredData.sort(function(a, b){
            return a.title.localeCompare(b.title);
        });
    }
    displayImages();
});

// Select 2 Plugin
$(document).ready(function() {
    $('#Topics').select2({
        placeholder: "Select"
    });
});

$(document).ready(function(){
    $('#sort-by').select2({
        placeholder: "Select"
    });
})

