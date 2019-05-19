let mdAddExercise = $('#mdAddExercise');
let mdAddDocument = $('#mdAddDocument');

function configEvents() {
    $('#btnAddDoc').click(function () {
        showEditDocumentArticle(null);
    });

    $('#btnAddDocPdf').click(function () {
        showEditDocumentPdf(null);
    });

    $('#btnAddExer').click(function () {
        $('#mdAddExercise').modal('show');
    });

    function configEditExercise() {
        $('#divExerciseList').on('click', 'button', function (e) {
            let data = $(e.target).parent().data('data');

            switch (data.type) {
                case 'LISTEN_AND_REWRITE':
                    {
                        showEditExerListenAndRewrite(data);
                        break;
                    }
                case 'FILL_MISSING_WORDS':
                    {
                        showEditExerFillMissingWords(data);
                        break;
                    }
                default: {

                }
            }
        });
    }

    function configEditDocument() {
        $('#divDocumentList').on('click', 'button.edit', function (e) {
            let data = $(e.target).parent().data('data');

            switch (data.type) {
                case 'ARTICLE':
                    {
                        showEditDocumentArticle(data);
                        break;
                    }
                case 'PDF':
                    {
                        showEditDocumentPdf(data);
                        break;
                    }
                default: {

                }
            }
        });
    }

    function configDeleteDocument() {
        $('#divDocumentList').on('click', 'button.delete', function (e) {
            let data = $(e.target).parent().data('data');

            if (confirm("Bạn có chắc chắn muốn xóa bài học này?"))
            {
                $.ajax({
                    type: "DELETE",
                    url: '/documents/'+ data._id,
                    success: function (data) {
                        if (data.status && data.status == 200) {
                            toastr.success('Xóa bài học thành công!');
                            getDocumentList();                           
                        } else {
                            toastr.error('Có lỗi trong quá trình xử lý yêu cầu!');
                        }
                    },
                    error: function () {
                        toastr.error('Có lỗi trong quá trình xử lý yêu cầu!');
                    },
                    dataType: 'json'
                });
            }           
        });
    }

    configEditExercise();
    configEditDocument();
    configDeleteDocument();
}

function getDocumentList() {
    function fill(list) {
        let div = $('#divDocumentList');

        div.empty();

        if (list.length == 0) {
            div.append(`
                        <div class="alert alert-warning" style="text-align: center; margin-top: 20px" role="alert">
                            Chưa bài học nào được cập nhật
                        </div>
                        `);
            return;
        }

        for (let item of list) {

            let divWrapper = document.createElement('div');
            $(divWrapper).data('data', item);
            divWrapper.className = 'card-body';

            let content = `       
                        <h5 class="card-title">${item.name}</h5>
                        <p class="card-text">${item.description}</p>
                        <button class="btn btn-primary edit">Sửa</button>  
                        <button class="btn btn-primary delete">Xóa</button>           
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
        success: function (data) {
            if (data.status && data.status == 200) {
                fill(data.data);
            } else {
                toastr.error('Có lỗi trong quá trình xử lý yêu cầu!');
            }
        },
        error: function () {
            toastr.error('Có lỗi trong quá trình xử lý yêu cầu!');
        },
        dataType: 'json'
    });
}

function getExerList() {
    function fill(list) {
        let div = $('#divExerciseList');

        div.empty();

        if (list.length == 0) {
            div.append(`
                        <div class="alert alert-warning" style="text-align: center; margin-top: 20px" role="alert">
                            Chưa bài tập nào được cập nhật
                        </div>
                        `);
            return;
        }

        for (let item of list) {

            let divWrapper = document.createElement('div');
            $(divWrapper).data('data', item);
            divWrapper.className = 'card-body';

            let content = `       
                        <h5 class="card-title">${item.name} <span class="badge badge-secondary">${item.type}</span></h5>
                        <p class="card-text">${item.description}</p>
                        <button class="btn btn-primary edit-document">Sửa</button>           
                        `;
            divWrapper.innerHTML = content;

            div.append(divWrapper);
        }
    }

    $.ajax({
        type: "GET",
        url: '/exercises',
        data: {
            classId: pageInfo.classId
        },
        success: function (data) {
            if (data.status && data.status == 200) {
                fill(data.data);
            } else {
                toastr.error('Có lỗi trong quá trình xử lý yêu cầu!');
            }
        },
        error: function () {
            toastr.error('Có lỗi trong quá trình xử lý yêu cầu!');
        },
        dataType: 'json'
    });
}

function configEditDocumentArticle() {

    function initCK() {
        CKEDITOR.replace('txtDocContent');
    }


    function edit() {

        let id = $('#mdAddDocumenttxtDocId').val();

        let data = {
            name: $('#mdAddDocumenttxtName').val(),
            description: $('#mdAddDocumenttxtDes').val(),
            content: CKEDITOR.instances.txtDocContent.getData(),
            classId: pageInfo.classId,
            type: constants.DOCUMENT.TYPE.ARTICLE
        }

        if (id && id.trim() != '')
            data.id = id;

        $.ajax({
            type: "POST",
            url: '/documents',
            data: data,
            success: function (data) {
                if (data.status && data.status == 200) {
                    toastr.success('Thao tác thành công!');
                    getDocumentList();
                    $('#mdAddDocument').modal('hide');
                } else {
                    toastr.error('Có lỗi trong quá trình xử lý yêu cầu!');
                }
            },
            error: function () {
                toastr.error('Có lỗi trong quá trình xử lý yêu cầu!');
            },
            dataType: 'json'
        });
    }

    $('#mdAddDocumentbtnEdit').click(function () {
        edit();
    });

    initCK();
}

function configEditDocumentPdf() {

    const modal = $('#mdAddPdfDocument');
    const txtId = modal.find('[name="id"]');
    const txtName = modal.find('[name="name"]');
    const txtDes = modal.find('[name="description"]');
    const btnEdit = modal.find('[name="edit"]');
    const filePdf = modal.find('[name="pdf"]');

    function edit() {

        const data = new FormData();
        const id = txtId.val();

        if (id && id.trim() != '')
            data.append('id', id);
        data.append('name', txtName.val());
        data.append('description', txtDes.val());
        data.append('classId', pageInfo.classId);
        data.append('pdf', filePdf[0].files[0]);
        data.append('type', constants.DOCUMENT.TYPE.PDF);

        btnEdit.attr('disabled', true);

        $.ajax({
            type: "POST",
            url: '/documents',
            data: data,
            processData: false,
            contentType: false,
            dataType: 'json',
            success: function (data) {
                if (data.status && data.status == 200) {
                    toastr.success('Thao tác thành công!');
                    getDocumentList();
                    modal.modal('hide');
                } else {
                    toastr.error('Có lỗi trong quá trình xử lý yêu cầu!');
                }
                btnEdit.attr('disabled', false);
            },
            error: function () {
                toastr.error('Có lỗi trong quá trình xử lý yêu cầu!');
                btnEdit.attr('disabled', false);
            }
        });
    }

    btnEdit.click(function () {
        edit();
    });
}

function showEditDocumentArticle(data) {
    if (!data)
        data = {};
    const { name = '', description = '', content = '', _id } = data;
    $('#mdAddDocumenttxtName').val(name);
    $('#mdAddDocumenttxtDes').val(description);
    CKEDITOR.instances.txtDocContent.setData(content);
    $('#mdAddDocumenttxtDocId').val(_id);
    $('#mdAddDocument').modal('show');
}

function showEditDocumentPdf(data) {
    const modal = $('#mdAddPdfDocument');
    const txtId = modal.find('[name="id"]');
    const txtName = modal.find('[name="name"]');
    const txtDes = modal.find('[name="description"]');
    const btnEdit = modal.find('[name="edit"]');
    const filePdf = modal.find('[name="pdf"]');

    if (!data)
        data = {};
    const { name = '', description = '', content = '', _id } = data;

    txtId.val(_id);
    txtName.val(name);
    txtDes.val(description);

    modal.modal('show');
}

function showEditExerListenAndRewrite(data) {
    let mainDiv = $('#div_edit_exer_listen_and_rewrite');
    let btnAddItem = mainDiv.find('[name=btn-add]');
    let divList = mainDiv.find('[name=div-list]');
    let btnAddExer = mainDiv.find('[name=btn-add-exer]');

    mainDiv.find('input[name="txt-name"]').val(data.name);
    mainDiv.find('input[name="txt-des"]').val(data.description);
    mainDiv.data('exercise', data);

    divList.empty();

    for (let item of data.content) {
        divList.append(`
        <div data-audioId="${item.audioId}" class="col-md-3 listen-and-rewrite-box">
            <div>
                <button type="button" class="close" aria-label="Close" onclick>
                            <span aria-hidden="true">×</span>
                </button>
                <input type="text" value=${item.text} class="form-control">
                <input style="margin-top: 5px" class="form-control-file" type="file">
            </div>
        </div>`);

    }

    changeModalTab('edit_exer_listen_and_rewrite', 'edit_exer_listen_and_rewrite');

    mdAddExercise.modal('show');
}

function showEditExerFillMissingWords(data) {
    let mainDiv = $('#div_edit_exer_fill_missing_words');
    let btnAddExer = mainDiv.find('[name=btn-add-exer]');

    mainDiv.find('input[name="txt-name"]').val(data.name);
    mainDiv.find('input[name="txt-des"]').val(data.description);
    CKEDITOR.instances.txtExerFillMissingWords.setData(data.content.paragraph);
    mainDiv.data('exercise', data);

    changeModalTab('edit_exer_fill_missing_words', 'edit_exer_fill_missing_words');

    mdAddExercise.modal('show');
}

function configEditExerListenAndRewrite() {
    let mainDiv = $('#div_edit_exer_listen_and_rewrite');
    let btnAddItem = mainDiv.find('[name=btn-add]');
    let divList = mainDiv.find('[name=div-list]');
    let btnAddExer = mainDiv.find('[name=btn-add-exer]');

    btnAddItem.click(function (e) {
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

    mainDiv.on('click', '.listen-and-rewrite-box button', function (e) {
        $(e.target).parent().parent().parent().parent()[0].removeChild($(e.target).parent().parent().parent()[0]);
    });

    btnAddExer.click(function () {
        let data = [];

        let list = divList.find('.listen-and-rewrite-box');

        let formData = new FormData();
        let name = mainDiv.find('input[name="txt-name"]').val();
        let description = mainDiv.find('input[name="txt-des"]').val();

        if (list.length===0)
        {
            toastr.error('Chưa có câu nào được tạo');
            return;
        }

        for (let item of list) {
            let text = $(item).find('input[type="text"]').val();
            let file = $(item).find('input[type="file"]')[0].files[0];
            let audioId = $(item).data('audioid');

            // if (text == null || !file) {
            //     toastr.error('Chưa điền đủ nhãn hoặc chưa chọn tệp âm thanh');
            //     return;
            // }

            if (!audioId && !file || !text) {
                toastr.error('Chưa điền đủ nhãn hoặc chưa chọn tệp âm thanh');
                return;
            }

            if (file)
                formData.append('hasFiles', true);
            else
                formData.append('hasFiles', false);

            formData.append('audioIds', audioId);
            formData.append('texts', text);
            formData.append('files', file);
        }

        if (mainDiv.data('exercise'))
            formData.append('id', mainDiv.data('exercise')._id);
        formData.append('classId', pageInfo.classId);
        formData.append('name', name);
        formData.append('exerciseType', 'LISTEN_AND_REWRITE');
        formData.append('description', description);

        $.ajax({
            type: "POST",
            url: '/exercises',
            data: formData,
            processData: false,
            contentType: false,
            success: function (data) {
                if (data.status && data.status == 200) {
                    toastr.success('Thao tác thành công!');
                    mdAddExercise.modal('hide');
                    getExerList();
                    // $('#mdAddDocument').modal('hide');
                } else {
                    toastr.error('Có lỗi trong quá trình xử lý yêu cầu!');
                }
            },
            error: function () {
                toastr.error('Có lỗi trong quá trình xử lý yêu cầu!');
            },
            dataType: 'json'
        });
    });
}

function configEditExerFillMissingWords() {
    let mainDiv = $('#div_edit_exer_fill_missing_words');
    let btnAddExer = mainDiv.find('[name=btn-add-exer]');

    function initCK() {
        CKEDITOR.replace('txtExerFillMissingWords', {
            extraPlugins: 'exerfilltext'
        });
    }

    initCK();

    btnAddExer.click(function () {
        let data;

        let name = mainDiv.find('input[name="txt-name"]').val();
        let description = mainDiv.find('input[name="txt-des"]').val();

        if (name.trim() === '') {
            toastr.error('Tên bài tập trống!');
            return;
        }

        data = {
            classId: pageInfo.classId,
            name: name,
            exerciseType: 'FILL_MISSING_WORDS',
            description, description,
            paragraph: CKEDITOR.instances.txtExerFillMissingWords.getData(),
        }

        if (mainDiv.data('exercise'))
            data.id = mainDiv.data('exercise')._id;

        $.ajax({
            type: "POST",
            url: '/exercises',
            data: data,
            success: function (data) {
                if (data.status && data.status == 200) {
                    toastr.success('Thao tác thành công!');
                    mdAddExercise.modal('hide');
                    getExerList();
                    // $('#mdAddDocument').modal('hide');
                } else {
                    toastr.error('Có lỗi trong quá trình xử lý yêu cầu!');
                }
            },
            error: function () {
                toastr.error('Có lỗi trong quá trình xử lý yêu cầu!');
            },
            dataType: 'json'
        });
    });
}

function configSettingClass() {
    const mainDiv = $('#divSettingClass');
    const switchIsPublic = mainDiv.find('[name="isPublic"]');
    const students = mainDiv.find('[name="students"]');
    const divStudents = mainDiv.find('[name="divStudents"]');
    const txtName = mainDiv.find('[name="name"]');
    const txtDescription = mainDiv.find('[name="description"]');
    const btnSave = mainDiv.find('[name="save"]');

    function getUsers() {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "GET",
                url: '/users',
                success: function (data) {
                    if (data.status && data.status == 200) {
                        resolve(data.data);
                    } else {
                        reject('status failure');
                    }
                },
                error: function (e) {
                    reject(e)
                },
                dataType: 'json'
            });
        });
    }

    function changeDisplayOfStudents(isPublic) {
        if (isPublic) {
            divStudents.hide();
        }
        else {
            divStudents.show();
        }
    }

    async function init() {
        switchIsPublic.bootstrapToggle();

        switchIsPublic.change(function () {
            const isChecked = $(this).prop('checked');
            changeDisplayOfStudents(isChecked);
        });

        const isPublic = (pageInfo.classType === constants.CLASS.TYPE.PUBLIC);
        switchIsPublic.bootstrapToggle(isPublic ? 'on' : 'off');

        changeDisplayOfStudents(isPublic);

        students.select2({ dropdownAutoWidth: true });

        try {
            const users = await getUsers();
            for (let user of users) {
                const newOption = new Option(`${user.lastName} ${user.firstName} (${user.phoneNumber})`, user._id, false, false);
                students.append(newOption).trigger('change');
            }
            students.val(pageInfo.classStudents.map(e => e._id));
        }
        catch (e) {
            console.log(e);
            toastr.error('Không thể lấy danh sách tài khoản!');
        }
    }

    function edit(data) {

        return new Promise(function (resolve, reject) {

            $.ajax({
                type: "POST",
                url: '/classes/' + pageInfo.classId,
                data: data,
                success: function (data) {
                    if (data.status && data.status == 200) {
                        resolve(data.data);
                    } else {
                        reject('status failure');
                    }
                },
                error: function (e) {
                    reject(e);
                },
                dataType: 'json'
            });
        });
    }

    function configEvents() {

        function validate(classData) {
            if (!classData.name || (classData.name + '').trim() === '' || !classData.description || (classData.description + '').trim() === '')
                return false;
            return true;
        }

        btnSave.click(async function () {
            btnSave.attr('disabled', true);
            try {
                const data = {
                    students: students.val(),
                    name: txtName.val(),
                    description: txtDescription.val(),
                    type: (switchIsPublic.prop('checked') ? constants.CLASS.TYPE.PUBLIC : constants.CLASS.TYPE.PRIVATE)
                }

                if (!validate(data)) {
                    toastr.error('Dữ liệu chưa hợp lệ!');
                    return;
                }

                await edit(data);
                toastr.success('Thao tác thành công!');
            }
            catch (e) {
                console.log(e);
                toastr.error('Có lỗi trong quá trình thực hiện yêu cầu!');
            }
            finally {
                btnSave.attr('disabled', false);
            }
        })
    }

    init();
    configEvents();
}

$(document).ready(function () {
    configEvents();
    getDocumentList();
    getExerList();
    configEditDocumentArticle();
    configEditDocumentPdf();
    configEditExerListenAndRewrite();
    configEditExerFillMissingWords();
    configSettingClass();
})