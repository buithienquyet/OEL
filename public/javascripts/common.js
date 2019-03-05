function changeTab(tabLink, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = ($(tabcontent[i]).data('tab-name') == tabName ? "block" : "none");
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {

        if ($(tablinks[i]).data('tab-link-name') != tabLink)
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        else
            $(tablinks[i]).addClass('active');
    }

}

function changeModalTab(tabLink, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("modaltabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = ($(tabcontent[i]).data('tab-name') == tabName ? "block" : "none");
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("modaltablinks");
    for (i = 0; i < tablinks.length; i++) {

        if ($(tablinks[i]).data('tab-link-name') != tabLink)
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        else
            $(tablinks[i]).addClass('active');
    }

}