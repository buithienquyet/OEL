function initCK() {
    CKEDITOR.replace('txtDocContent');
}

function configEvents() {
    $('#btnAddDoc').click(function() {
        $('#mdAddDocument').modal('show');
    });

    $('#divDocumentList').on('click', 'button', function(e) {
        let data = $(e.target).parent().data('data');

        let view = $('.tab_document_view_doc');

        view.find('h3').html(data.name);
        view.find('h4').html(data.description);
        view.find('p').html(data.content);

        changeTab('document', 'document_view_doc');

        // $('#mdAddDocumenttxtName').val(data.name);
        // $('#mdAddDocumenttxtDes').val(data.description);
        // CKEDITOR.instances.txtDocContent.setData(data.content);
        // $('#mdAddDocumenttxtDocId').val(data._id);
        // $('#mdAddDocument').modal('show');
    });
}

function getDocumentList() {

    function fill(list) {
        let div = $('#divDocumentList');

        div.empty();

        if (list.length == 0)
            div.html(`Chưa có mục nào được cập nhật!`);
        else
            for (let item of list) {

                let divWrapper = document.createElement('div');
                $(divWrapper).data('data', item);
                divWrapper.className = 'card-body';

                let content = `       
                            <h5 class="card-title">${item.name}</h5>
                            <p class="card-text">${item.description}</p>
                            <button class="btn btn-primary view-document">Xem ngay</button>           
                            `;
                divWrapper.innerHTML = content;

                div.append(divWrapper);
            }

    }

    $.ajax({
        type: "GET",
        url: '/documents',
        data: {
            classId: pageInfo.classId
        },
        success: function(data) {
            if (data.status && data.status == 200) {
                fill(data.data);
            } else {
                toastr.error('Có lỗi trong quá trình xử lý yêu cầu!');
            }
        },
        error: function() {
            toastr.error('Có lỗi trong quá trình xử lý yêu cầu!');
        },
        dataType: 'json'
    });
}

function configEditDocument() {

    function edit() {

        let id = $('#mdAddDocumenttxtDocId').val();

        let data = {
            name: $('#mdAddDocumenttxtName').val(),
            description: $('#mdAddDocumenttxtDes').val(),
            content: CKEDITOR.instances.txtDocContent.getData(),
            classId: pageInfo.classId
        }

        if (id && id.trim() != '')
            data.id = id;

        $.ajax({
            type: "POST",
            url: '/documents',
            data: data,
            success: function(data) {
                if (data.status && data.status == 200) {
                    toastr.success('Thao tác thành công!');
                    getDocumentList();
                    $('#mdAddDocument').modal('show');
                } else {
                    toastr.error('Có lỗi trong quá trình xử lý yêu cầu!');
                }
            },
            error: function() {
                toastr.error('Có lỗi trong quá trình xử lý yêu cầu!');
            },
            dataType: 'json'
        });
    }

    $('#mdAddDocumentbtnEdit').click(function() {
        edit();
    });
}

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
        if ($(tablinks[i].className).data('tab-link-name') != tabLink)
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        else
            tablinks[i].addClass('active');
    }

}


$(document).ready(function() {
    //   initCK();

    configEvents();
    getDocumentList();
    //   configEditDocument();
})