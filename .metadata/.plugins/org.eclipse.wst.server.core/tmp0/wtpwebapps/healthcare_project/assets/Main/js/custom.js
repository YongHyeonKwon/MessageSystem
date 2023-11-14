/**
 * 
 */

$(document).ready(function() {

	$('.dataTable').DataTable({
		ajax: {
			url: "/Members.say?c=json",
			type: "GET",
			dataType: "json",
			dataSrc: ''
		},
		columnDefs: [
			{
				target: 1,
				visible: false,
				searchable: false
			}
		],
		columns: [
			{
				data: "photopath",

				render: function(data, type, row, meta) {
					const date = new Date();
					const year = date.getFullYear();
					const month = date.getMonth();
					return '<a href="Members.say?c=member&collection=' + year + (month >= 10 ? month : '0' + month) + '&fieldName=_id&value=' + row.no + '&valueType=int&dataType=json"><img src="images//Member//example.jpg" width="50px"></a>';
				}
			},
			{
				data: "no"
			},
			{ data: "name" },
			{ data: "age" },
			{ data: "gender" },
			{ data: "weight" },
			{ data: "height" },
			{ data: "job" },
			{ data: "phone_number" },
			{ data: "trainer" },
			{ data: "regist_day" }
		],
		search: {
			return: true
		},
		ordering: true, // ordering 활성화
		order: [[1, "asc"]], //0번째 컬럼 오름차순
		paging: true, //페이징 기능 활성화. 기본이 true

		/*numbers - Page number buttons only
simple - 'Previous' and 'Next' buttons only
simple_numbers - 'Previous' and 'Next' buttons, plus page numbers
full - 'First', 'Previous', 'Next' and 'Last' buttons
full_numbers - 'First', 'Previous', 'Next' and 'Last' buttons, plus page numbers
first_last_numbers - 'First' and 'Last' buttons, plus page numbers*/
		pagingType: "simple_numbers", // 페이징 버튼 타입 설정
		pageLength: 20, // 한페이지에 보여주는 데이터 개수 
		responsive: true, // 스크립트를 추가하면 반응형으로 작동하게해줌
		lengthChange: false, // pageLength 조절 불가하게 해줌
		info: true, // 페이지 상태표시
		autoWidth: false, //페이지 좌우 크기 조절시 테이블 크기 자동 적용
		select: true,
		serverSide: false,
		processing: true, // 서버와 통신 시 응답을 받기 전이라는 ui를 띄울 것인지 여부
		dom: 'Blfrtip',
		colReorder: true,
		scrollX: false,
		scrollCollapse: true,
		scrollY: '400px'
	});

});