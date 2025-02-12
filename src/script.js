const searchButton = document.getElementById('search-button');
const characterNameInput = document.getElementById('character-name');
const viewChatUserGraph = document.getElementById('view-chatuser-graph');
const viewLikeGraph = document.getElementById('view-like-graph');
const viewChatGraph = document.getElementById('view-chat-graph');
const viewCommentGraph = document.getElementById('view-comment-graph');
const like_correlation = document.getElementById('like-correlation');
const chat_correlation = document.getElementById('chat-correlation');
const like_equation = document.getElementById('like-equation');
const chat_equation = document.getElementById('chat-equation');
const userchatBYuser = document.getElementById('userChat/user');
const likeBYuser = document.getElementById('like/user');
const commentBYuser = document.getElementById('comment/user');
const fresh = document.getElementById('fresh');
const characterName = document.getElementById('name');
const timeL = document.getElementById('time');
var initTime = timeL.textContent;

setInterval(()=>{
    var today = new Date();
    if (today.getMinutes() < 10){
        today.setMinutes(9 - today.getMinutes());
    }
    else if (today.getMinutes() < 20){
        today.setMinutes(19 - today.getMinutes());
    }
    else if (today.getMinutes() < 30){
        today.setMinutes(29 - today.getMinutes());
    }
    else if (today.getMinutes() < 40){
        today.setMinutes(39 - today.getMinutes());
    }
    else if (today.getMinutes() < 50){
        today.setMinutes(49 - today.getMinutes());
    }
    else if (today.getMinutes() < 60){
        today.setMinutes(59 - today.getMinutes());
    }
    today.setSeconds(60 - today.getSeconds());
    var minute = today.getMinutes() >= 10 ? today.getMinutes() : '0' + today.getMinutes();
    var second = today.getSeconds() >= 10 ? today.getSeconds() : '0' + today.getSeconds();
    timeL.textContent = initTime + `${minute}:${second}`;
})

var getParameters = function (paramName) {
    // 리턴값을 위한 변수 선언
    var returnValue;
    
    // 현재 URL 가져오기
    var url = location.href;
    
    // get 파라미터 값을 가져올 수 있는 ? 를 기점으로 slice 한 후 split 으로 나눔
    var parameters = (url.slice(url.indexOf('?') + 1, url.length)).split('&');
    
    // 나누어진 값의 비교를 통해 paramName 으로 요청된 데이터의 값만 return
    for (var i = 0; i < parameters.length; i++) {
        var varName = parameters[i].split('=')[0];
        if (varName.toUpperCase() == paramName.toUpperCase()) {
            returnValue = parameters[i].split('=')[1];
            return decodeURIComponent(returnValue);
        }
    }
};
console.log(getParameters("charId"));
if (getParameters("charId") != undefined){
    characterNameInput.value = getParameters("charId");
    // 캐릭터 이름으로 조회수와 좋아요수 데이터를 가져오는 함수 호출
    getCharacterData(getParameters("charId"))
        .then(data => {
            // 그래프 그리기
            drawGraph(data);
        });
}

searchButton.addEventListener('click', () => {
    location.href = `http://www.fastjournal.kro.kr/index.html?charId=${characterNameInput.value}`
});

async function getCharacterData(charId) {
    // 실제 데이터를 가져오는 API 호출 또는 데이터베이스 조회
    // 예시 데이터
    return new Promise(resolve => {
        setTimeout(() => {
            fetch(`http://api.fastwrtn.kro.kr/character?charId=${charId}`).then(res => res.json()).then(charInfo => {
                if (charInfo.FAIL != null){
                    if (charInfo.FAIL == "Character Id founded but to tracing log so added tracer"){
                        alert("통계추적에 등록 되지 않았던 캐릭터 ID 입니다. 지금부터 통계추적에 포함시키겠습니다. (10분마다 업데이트 됩니다)");
                    }
                    if (charInfo.FAIL == "Character Id not founded"){
                        alert("잘못된 캐릭터 ID 입니다.");
                    }
                    return true;
                }
                resolve({
                    charId: charInfo['data']['name'],
                    labels: charInfo['data']['labels'],
                    chatCount: charInfo['data']['chatCount'],
                    chatUserCount: charInfo['data']['chatUserCount'],
                    likeCount: charInfo['data']['likeCount'],
                    commentCount: charInfo['data']['commentCount']
                });
            }).catch(() => {alert("잘못된 캐릭터 ID 입니다.")})
        }, 1000);
    });
}

function drawGraph(data) {
    let chartStatus = Chart.getChart('view-like-graph');
    if (chartStatus !== undefined) {
        chartStatus.destroy();
    }
    let chartStatus2 = Chart.getChart('view-chat-graph');
    if (chartStatus2 !== undefined) {
        chartStatus2.destroy();
    }
    let chartStatus3 = Chart.getChart('view-comment-graph');
    if (chartStatus3 !== undefined) {
        chartStatus3.destroy();
    }
    var cbu = data.chatCount[data.chatCount.length - 1] / data.chatUserCount[data.chatUserCount.length - 1];
    var lbu = data.likeCount[data.likeCount.length - 1] / data.chatUserCount[data.chatUserCount.length - 1];
    var mbu = data.commentCount[data.commentCount.length - 1] / data.chatUserCount[data.chatUserCount.length - 1]; 
    characterName.textContent += data.charId;
    userchatBYuser.textContent += cbu;
    likeBYuser.textContent += lbu;
    commentBYuser.textContent += mbu
    if (cbu > 1.6){
        fresh.textContent += "완벽하게 신선함";
    }
    else if (cbu > 1.4){
        fresh.textContent += "매우 신선함";
    }
    else if (cbu > 1.3){
        fresh.textContent += "신선함";
    }
    else if (cbu > 1.2){
        fresh.textContent += "어느정도 신선함";
    }
    else if (cbu > 1.1){
        fresh.textContent += "보통 신선함";
    }
    else if (cbu > 1.0){
        fresh.textContent += "낮은 신선함";
    }
    else {
        fresh.textContent += "신선하지 않음";
    }
    const cix = viewChatUserGraph.getContext('2d');
    const ctx = viewLikeGraph.getContext('2d');
    const cdx = viewChatGraph.getContext('2d');
    const ccx = viewCommentGraph.getContext('2d');
    const clx = like_correlation.getContext('2d');
    const ckx = chat_correlation.getContext('2d');
    var cc = [];
    var cc2 = [];
    var test = [];
    var test2 = [];
    for (let index = 0; index < data.chatUserCount.length; index++) {
        cc[cc.length] = {x: data.chatUserCount[index], y:data.likeCount[index]};
    }
    for (let index = 0; index < data.chatUserCount.length; index++) {
        cc2[cc2.length] = {x: data.chatUserCount[index], y:data.chatCount[index]};
    }
    for (let index = 0; index < data.chatUserCount.length; index++) {
        test[test.length] = [data.chatUserCount[index],data.chatCount[index]];
    }
    for (let index = 0; index < data.chatUserCount.length; index++) {
        test2[test2.length] = [data.chatUserCount[index],data.likeCount[index]];
    }
    const result = regression.linear(test);
    chat_equation.textContent = result.string;
    const result2 = regression.linear(test2);
    like_equation.textContent = result2.string;
    new Chart(clx, {
        type: 'scatter', // 산점도 그래프
        data: {
          datasets: [{
                label: '유저 수와 좋아요 수 상관관계',
                data: [result2.points[0],result2.points[result2.points.length-1]],
                type: 'line',
                borderColor: 'rgb(15, 0, 3)', // 선 색상
            },{
            label: '유저 수와 좋아요 수 상관관계',
            data: cc,
            backgroundColor: 'rgba(54, 162, 235, 0.2)', // 점 색상
            borderColor: 'rgba(54, 162, 235, 1)', // 점 테두리 색상
            borderWidth: 1,
            pointRadius: 5 // 점 크기
          }]
        },
        options: {
          scales: {
            x: {
              title: {
                display: true,
                text: '유저 수'
              }
            },
            y: {
              title: {
                display: true,
                text: '좋아요 수'
              }
            }
          }
        }
      });
    new Chart(ckx, {
    type: 'scatter', // 산점도 그래프
    data: {
        datasets: [{
            label: '유저 수와 좋아요 수 상관관계',
            data: [result.points[0],result.points[result.points.length-1]],
            type: 'line',
            borderColor: 'rgb(0, 0, 0)', // 선 색상
        },{
            label: '유저 수와 채팅방 수 상관관계',
            data: cc2,
            backgroundColor: 'rgba(235, 54, 54, 0.2)', // 점 색상
            borderColor: 'rgb(235, 54, 54)', // 점 테두리 색상
            borderWidth: 1,
            pointRadius: 5, // 점 크기
        }]
    },
    options: {
        scales: {
        x: {
            title: {
            display: true,
            text: '유저 수'
            }
        },
        y: {
            title: {
            display: true,
            text: '채팅방 수'
            }
        }
        },
        legend: {
            reverse: true
        }
    }
    });
    new Chart(cix, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: '채팅한유저수',
                data: data.chatUserCount,
                borderColor: 'red',
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: '날짜'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: '횟수'
                    }
                }
            }
        }
    });
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: '채팅방수',
                data: data.chatCount,
                borderColor: 'blue',
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: '날짜'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: '횟수'
                    }
                }
            }
        }
    });
    new Chart(cdx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: '좋아요수',
                data: data.likeCount,
                borderColor: 'purple',
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: '날짜'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: '횟수'
                    }
                }
            }
        }
    });
    new Chart(ccx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: '댓글수',
                data: data.commentCount,
                borderColor: 'yellow',
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: '날짜'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: '횟수'
                    }
                }
            }
        }
    });
}