<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8" isELIgnored="false"%>
<!DOCTYPE html>
<html lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta charset="utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>HealthCare | SAYPROJECT</title>
</head>
<body>

	<div class="text-center">

		<div class="spinner-border text-primary" role="status">
			<span class="sr-only">Loading...</span>
		</div>
		<div class="spinner-border text-secondary" role="status">
			<span class="sr-only">Loading...</span>
		</div>
		<div class="spinner-border text-success" role="status">
			<span class="sr-only">Loading...</span>
		</div>
		<div class="spinner-border text-danger" role="status">
			<span class="sr-only">Loading...</span>
		</div>
		<div class="spinner-border text-warning" role="status">
			<span class="sr-only">Loading...</span>
		</div>
		<div class="spinner-border text-info" role="status">
			<span class="sr-only">Loading...</span>
		</div>
		<div class="spinner-border text-light" role="status">
			<span class="sr-only">Loading...</span>
		</div>
		<div class="spinner-border text-dark" role="status">
			<span class="sr-only">Loading...</span>
		</div>

	</div>
	<jsp:include page="/WEB-INF/views/include/footer_script.jsp" />
	<script src="https://t1.kakaocdn.net/kakao_js_sdk/2.4.0/kakao.min.js"
		integrity="sha384-mXVrIX2T/Kszp6Z0aEWaA8Nm7J6/ZeWXbL8UpGRjKwWe56Srd/iyNmWMBhcItAjH"
		crossorigin="anonymous"></script>
	<script>
	/****** BH 의 카카오 프로젝트 KEY ****/
      Kakao.init("14274277b7b930e3289085afa313c81c");

      const getAccessToken = async () => {
        await fetch("https://kauth.kakao.com/oauth/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
          },
          body: `grant_type=authorization_code&client_id=14274277b7b930e3289085afa313c81c&redirect_uri=http://localhost/Main.say?c=kakao&code=${code}`,
        })
          .then((response) => response.json())
          .then((json) => {
            Kakao.Auth.setAccessToken(json.access_token);
          })
          .catch((err) => {
            console.log(
              "[getAccessToken] failed to request user information: " + JSON.stringify(err)
            );
            //window.location.href = "/Main.say";
          });
      };
	// 로그인 후 해당 계정 정보를 가져오는 함수
	// 가져온 후 정보를 dbCheck 하는 곳으로 전송, 이동한다.
      const requestUserInfo = async () => {
        await Kakao.API.request({
          url: "/v2/user/me",
        })
          .then((res) => {
            const jsonData = JSON.stringify(res)
            sendDataLoginProcess(jsonData)
          })
          .catch((err) => {
            console.log(
              "[requestUserInfo] failed to request user information: " + JSON.stringify(err)
            );
          });
      };

      const sendDataLoginProcess = async (data) => {
          const url = '/Main.say?c=kakaoCheck';
          const form = $('<form action="' + url + '" method="post">' +
            '<textarea name="kakaoInfo" style="display:none">' + data + '</textarea>' +
            '</form>');
          $('body').append(form);
          form.submit();
      }
      
      const kakaoLogin = async () => {
          await getAccessToken();
          await requestUserInfo();
      }

      kakaoLogin()
      
      /*
      $.ajax({
    	    type : "POST"
    	    , url : 'https://kauth.kakao.com/oauth/token'
    	    , data : {
    	        grant_type : 'authorization_code',
    	        client_id : '14274277b7b930e3289085afa313c81c',
    	        redirect_uri : 'http://localhost/Main.say?c=kakao',
    	        code : '${code}',
    	    }
    	    , contentType:'application/x-www-form-urlencoded;charset=utf-8'
    	    , dataType: null
    	    , success : function(response) {
    	        Kakao.Auth.setAccessToken(response.access_token);
    	        requestUserInfo()
    	    }
    	    ,error : function(jqXHR, error) {
				console.log(jqXHR, error)
    	    }
    	});
      */

      /** fetch 방식, async, await 적용 
      * code 값을 이용하여 access_token 값을 가져와 set 한다.
      ***/
    </script>
</body>
</html>
