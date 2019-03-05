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

    function configEditExercise() {
        $('#divExerciseList').on('click', 'button', function(e) {
            let data = $(e.target).parent().data('data');

            switch (data.type) {
                case 'LISTEN_AND_REWRITE':
                    {
                        showDoExerListenAndRewrite(data);
                        break;
                    }
            }
        });
    }

    configEditExercise();
}

function showDoExerListenAndRewrite(data) {
    let mainDiv = $('#div_do_exer_listen_and_rewrite');
    // let btnAddItem = mainDiv.find('[name=btn-add]');
    let divList = mainDiv.find('[name=div-list]');
    // let btnAddExer = mainDiv.find('[name=btn-add-exer]');

    // mainDiv.find('input[name="txt-name"]').val(data.name);
    // mainDiv.find('input[name="txt-des"]').val(data.description);
    mainDiv.data('exercise', data);

    divList.empty();

    for (let item of data.content) {

        let div = $(document.createElement('div'));

        div.addClass('col-md-3').addClass('listen-and-rewrite-box');
        div.data('itemdata', item);
        div.html(`
                    <div>                          
                        <div style="padding: 0px; margin-bottom: 15px">
                            <button style="width: 50px; border: black solid 1px" class="btn btn-default btn-xs btn-listen">
                                <svg class="svg-icon" viewBox="0 0 20 20">
                                    <path d="M17.969,10c0,1.707-0.5,3.366-1.446,4.802c-0.076,0.115-0.203,0.179-0.333,0.179c-0.075,0-0.151-0.022-0.219-0.065c-0.184-0.122-0.233-0.369-0.113-0.553c0.86-1.302,1.314-2.812,1.314-4.362s-0.454-3.058-1.314-4.363c-0.12-0.183-0.07-0.43,0.113-0.552c0.186-0.12,0.432-0.07,0.552,0.114C17.469,6.633,17.969,8.293,17.969,10 M15.938,10c0,1.165-0.305,2.319-0.88,3.339c-0.074,0.129-0.21,0.201-0.347,0.201c-0.068,0-0.134-0.016-0.197-0.052c-0.191-0.107-0.259-0.351-0.149-0.542c0.508-0.9,0.776-1.918,0.776-2.946c0-1.028-0.269-2.046-0.776-2.946c-0.109-0.191-0.042-0.434,0.149-0.542c0.193-0.109,0.436-0.042,0.544,0.149C15.634,7.681,15.938,8.834,15.938,10 M13.91,10c0,0.629-0.119,1.237-0.354,1.811c-0.063,0.153-0.211,0.247-0.368,0.247c-0.05,0-0.102-0.01-0.151-0.029c-0.203-0.084-0.301-0.317-0.217-0.521c0.194-0.476,0.294-0.984,0.294-1.508s-0.1-1.032-0.294-1.508c-0.084-0.203,0.014-0.437,0.217-0.52c0.203-0.084,0.437,0.014,0.52,0.217C13.791,8.763,13.91,9.373,13.91,10 M11.594,3.227v13.546c0,0.161-0.098,0.307-0.245,0.368c-0.05,0.021-0.102,0.03-0.153,0.03c-0.104,0-0.205-0.04-0.281-0.117l-3.669-3.668H2.43c-0.219,0-0.398-0.18-0.398-0.398V7.012c0-0.219,0.179-0.398,0.398-0.398h4.815l3.669-3.668c0.114-0.115,0.285-0.149,0.435-0.087C11.496,2.92,11.594,3.065,11.594,3.227 M7.012,7.41H2.828v5.18h4.184V7.41z M10.797,4.189L7.809,7.177v5.646l2.988,2.988V4.189z"></path>
                                </svg>
                            </button>
                        </div>
                        <input type="text" class="form-control txt-text">
                    </div>
                `);

        divList.append(div);
    }

    changeTab('exercise', 'do_exer_listen_and_rewrite');
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
                            <button class="btn btn-default view-document">Xem ngay</button>           
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

function getExerciseList() {
    function fill(list) {
        let div = $('#divExerciseList');

        div.empty();

        if (list.length == 0)
            div.html(`Chưa có mục nào được cập nhật!`);
        else
            for (let item of list) {

                let divWrapper = document.createElement('div');
                $(divWrapper).data('data', item);
                divWrapper.className = 'card-body';

                let content = `       
                        <h5 class="card-title">${item.name} <span class="badge badge-secondary">${item.type}</span></h5>
                        <p class="card-text">${item.description}</p>
                        <button class="btn btn-default edit-document">Làm bài tập</button>           
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

function configDoExerListenAndRewrite() {
    let mainDiv = $('#div_do_exer_listen_and_rewrite');
    // let btnAddItem = mainDiv.find('[name=btn-add]');
    let divList = mainDiv.find('[name=div-list]');
    let btnSubmit = mainDiv.find('[name=btn-submit]');

    mainDiv.on('click', '.listen-and-rewrite-box .btn-listen', function(e) {
        let url = '/audios/' + $(e.target).parent().parent().parent().data('itemdata').audio;
        new Audio(url).play();
    });

    mainDiv.on('click', '.listen-and-rewrite-box .btn-listen', function(e) {
        let url = '/audios/' + $(e.target).parent().parent().parent().data('itemdata').audio;
        new Audio(url).play();
    });

    mainDiv.on('change', '.listen-and-rewrite-box .txt-text', function(e) {
        let box = $(e.target).parent().parent();
        box.attr('class', 'col-md-3 listen-and-rewrite-box');
        if ($(e.target).val() != '') {
            box.addClass('listen-and-rewrite-box-done');
        }
    });

    btnSubmit.click(function() {
        let data = { answers: [] };
        let exerciseData = mainDiv.data('exercise');

        let list = divList.find('.listen-and-rewrite-box');

        for (let item of list) {
            let text = $(item).find('input[type="text"]').val();
            let audioId = $(item).data('itemdata').audioId;
            data.answers.push({ text, audioId });
        }

        data.classId = exerciseData.classId;
        data.exerciseId = exerciseData._id;
        data.type = exerciseData.type;

        $.ajax({
            type: "POST",
            url: '/answer-sheets',
            data: data,
            success: function(data) {
                if (data.status && data.status == 200) {

                    let cnt = 0;

                    for (let attr in data.data) {
                        if (data.data[attr])
                            cnt++;
                    }

                    toastr.success(`Bạn trả lời đúng ${cnt}/${Object.keys(data.data).length} câu`);

                    for (let element of mainDiv.find('.listen-and-rewrite-box')) {
                        let box = $(element);
                        box.attr('class', 'col-md-3 listen-and-rewrite-box');
                        let audioId = box.data('itemdata').audioId;
                        if (data.data[audioId]) {
                            box.addClass('listen-and-rewrite-box-correct');
                        } else {
                            box.addClass('listen-and-rewrite-box-wrong');
                        }
                    };

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
    //   initCK();

    configEvents();
    getDocumentList();
    getExerciseList();
    configDoExerListenAndRewrite();
    //   configEditDocument();
})