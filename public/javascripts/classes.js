
function fillStudentClassList(data) {

    const divList = $('.student-list');

    if (data.length != 0) {
        for (let item of data) {

            divList.append(`
            <li>
                <a class="wow fadeInLeft" href="/classes/${item._id}" data-wow-duration="1s" data-wow-delay=".1s">
                    <i class="fa fa-book"></i> ${item.name}
                </a>
            </li>`
            );
        }
    } else {
        divList.append(`
            <div class="alert alert-warning" role="alert">
                Chưa có lớp nào trong danh sách
            </div>
        `);
    }
}

function fillTeacherClassList(data) {

    const divList = $('.teacher-list');

    if (data.length !== 0)
    {
        for (let item of data) {
            divList.append(`
                <li>
                    <a class="wow fadeInLeft" href="/classes/${item._id}" data-wow-duration="1s" data-wow-delay=".1s">
                        <i class="fa fa-book"></i> ${item.name}
                    </a>
                </li>`
            );
        }
    }
    else {
        divList.append(`
            <div class="alert alert-warning" role="alert">
                Chưa có lớp nào trong danh sách
            </div>
        `);
    }
}

function getClassList() {

    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');

    $.ajax({
        type: "GET",
        url: '/classes/list',
        data: {
            search: searchQuery
        },
        success: function (data) {
            if (data.status && data.status == 200) {

                let students = [];
                let teachers = [];

                for (let item of data.data) {
                    if (item.createdBy == userInfo.id)
                        teachers.push(item);
                    else
                        students.push(item);
                }

                $('.student-list').html('');
                $('.teacher-list').html('');

                fillStudentClassList(students);
                fillTeacherClassList(teachers);

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
}

function configAddClass() {
    const btnCreate = $('#btnCreateClass');
    const mdCreate = $('#mdCreateClass');
    const mdCreateClassBtnAdd = $('#mdCreateClassBtnAdd');

    function createClass() {
        function validate() {
            const name = $('#mdTxtName').val();
            const des = $('#mdTxtDes').val();

            if (name.trim() == '' || des.trim() == '') {
                toastr.error('Bạn chưa điền đầy đủ thông tin!');
                return false;
            }

            return true;
        }

        if (validate()) {

            const name = $('#mdTxtName').val();
            const description = $('#mdTxtDes').val();
            const type = $('#mdToggleIsPublic').prop('checked') ? 'PUBLIC' : 'PRIVATE';

            $.ajax({
                type: "POST",
                url: '/classes',
                data: {
                    name, description, type
                },
                success: function (data) {
                    if (data.status === 200) {
                        toastr.success('Thêm lớp mới thành công!');
                        getClassList();
                        mdCreate.modal('hide');
                    }
                    else {
                        toastr.error(data.msg);
                    }
                },
                error: function (error) {
                    toastr.error('Có lỗi trong quá trình thực hiện yêu cầu của bạn!');
                }
            });
        }
    }

    btnCreate.click(function () {
        mdCreate.modal('show');
    });

    mdCreateClassBtnAdd.click(function () {
        createClass();
    });
}

configAddClass();
getClassList();
