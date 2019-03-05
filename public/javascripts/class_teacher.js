let mdAddExercise = $('#mdAddExercise');
let mdAddDocument = $('#mdAddDocument');

function initCK() {
    CKEDITOR.replace('txtDocContent');
}

function configEvents() {
    $('#btnAddDoc').click(function() {
        $('#mdAddDocument').modal('show');
    });

    $('#btnAddExer').click(function() {
        $('#mdAddExercise').modal('show');
    });
}

function getDocumentList() {
    function fill(list) {
        let div = $('#divDocumentList');

        div.empty();

        if (list.lenght == 0)
            div.innerHTML = `Chưa có mục nào được cập nhật!`;

        for (let item of list) {

            let divWrapper = document.createElement('div');
            $(divWrapper).data('data', item);
            divWrapper.className = 'card-body';

            let content = `       
                        <h5 class="card-title">${item.name}</h5>
                        <p class="card-text">${item.description}</p>
                        <button class="btn btn-primary edit-document">Sửa</button>           
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
                    $('#mdAddDocument').modal('hide');
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

    $('#divDocumentList').on('click', 'button', function(e) {
        let data = $(e.target).parent().data('data');

        $('#mdAddDocumenttxtName').val(data.name);
        $('#mdAddDocumenttxtDes').val(data.description);
        CKEDITOR.instances.txtDocContent.setData(data.content);
        $('#mdAddDocumenttxtDocId').val(data._id);
        $('#mdAddDocument').modal('show');
    });
}

function configEditExerListenAndRewrite() {
    let mainDiv = $('#div_edit_exer_listen_and_rewrite');
    let btnAddItem = mainDiv.find('[name=btn-add]');
    let divList = mainDiv.find('[name=div-list]');
    let btnAddExer = mainDiv.find('[name=btn-add-exer]');

    btnAddItem.click(function(e) {
        divList.append(`
                    <div class="col-md-3 listen-and-rewrite-box">
                        <div>
                            <button type="button" class="close" aria-label="Close" onclick>
                                        <span aria-hidden="true">×</span>
                                    </button>
                            <input type="text" class="form-control">
                            <input style="margin-top: 5px" class="form-control-file" type="file">
                        </div>
                    </div>
        `);
    });

    mainDiv.on('click', '.listen-and-rewrite-box button', function(e) {
        $(e.target).parent().parent().parent()[0].removeChild($(e.target).parent().parent()[0]);
    });

    btnAddExer.click(function() {
        let data = [];

        let list = divList.find('.listen-and-rewrite-box');

        let formData = new FormData();
        let name = mainDiv.find('input[name="txt-name"]').val();
        let description = mainDiv.find('input[name="txt-des"]').val();

        for (let item of list) {
            let text = $(item).find('input[type="text"]').val();
            let file = $(item).find('input[type="file"]')[0].files[0];

            // if (text == null || !file) {
            //     toastr.error('Chưa điền đủ nhãn hoặc chưa chọn tệp âm thanh');
            //     return;
            // }

            formData.append('texts', text);
            formData.append('files', file);
        }

        formData.append('classId', pageInfo.classId);
        formData.append('name', name);
        formData.append('exerciseType', 'LISTEN_AND_REWRITE');
        formData.append('description', description);

        $.ajax({
            type: "POST",
            url: '/excercises',
            data: formData,
            processData: false,
            contentType: false,
            success: function(data) {
                if (data.status && data.status == 200) {
                    toastr.success('Thao tác thành công!');
                    mdAddExercise.modal('hide');
                    // $('#mdAddDocument').modal('hide');
                } else {
                    toastr.error('Có lỗi trong quá trình xử lý yêu cầu!');
                }
            },
            error: function() {
                toastr.error('Có lỗi trong quá trình xử lý yêu cầu!');
            },
            dataType: 'json'
        });

    });
}

$(document).ready(function() {

    initCK();
    configEvents();
    getDocumentList();
    configEditDocument();
    configEditExerListenAndRewrite();
})