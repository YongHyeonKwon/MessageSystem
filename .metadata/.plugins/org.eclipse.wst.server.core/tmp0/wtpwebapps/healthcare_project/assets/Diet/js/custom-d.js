let year = "2023";
let month = "08";
let day = "03";
let day_n = Number(day);
let memberID = "3";

let moveUrl = `http://localhost/Members.say?c=member&collection=${
  year + month
}&fieldName=_id&value=${memberID}&valueType=int&dataType=json`;
let memberDailyInfo;

const loadMemberDailyInfo = async () => {
  await $.ajax({
    url: moveUrl,
    success: function (data) {
      memberDailyInfo = data.dailyInfo;
      console.log(data);
    },
    error: function () {
      console.log("요청이 안됨");
    },
  });
};

const loadmember = async () => {
  await loadMemberDailyInfo();

  var meal = {
    "breakfast":memberDailyInfo[(day_n - 1)].diet.breakfast,
    "lunch":memberDailyInfo[(day_n - 1)].diet.lunch,
    "dinner":memberDailyInfo[(day_n - 1)].diet.dinner,
    "otherfood":memberDailyInfo[(day_n - 1)].diet.otherfood
    };

    console.log(typeof(meal))
    const sendFoodName = async () => {
        await $.ajax({
            url : "/Diet.say?c=foodname",
            type : "POST",
            data : {
                foodName : JSON.stringify(meal)                
            },
            dataType : 'text',
            success: function(data) {
                console.log(meal);
                console.log("전송 성공");

            },
            error: function(error) {
                console.log("전송 실패", error);
            }
        })
    }

    sendFoodName();

};

loadmember();