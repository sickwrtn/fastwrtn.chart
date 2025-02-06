const searchButton = document.getElementById('search-button');
const characterNameInput = document.getElementById('character-name');
const viewLikeGraph = document.getElementById('view-like-graph');
const viewChatGraph = document.getElementById('view-chat-graph');
const viewCommentGraph = document.getElementById('view-comment-graph');
searchButton.addEventListener('click', () => {
    const charId = characterNameInput.value;
    // 캐릭터 이름으로 조회수와 좋아요수 데이터를 가져오는 함수 호출
    getCharacterData(charId)
        .then(data => {
            // 그래프 그리기
            drawGraph(data);
        });
});

async function getCharacterData(charId) {
    // 실제 데이터를 가져오는 API 호출 또는 데이터베이스 조회
    // 예시 데이터
    return new Promise(resolve => {
        setTimeout(() => {
            fetch(`http://api.fastwrtn.kro.kr/character?charId=${charId}`).then(res => res.json()).then(charInfo => {
                if (charInfo.FAIL != null){
                    if (charInfo.FAIL == "Character Id founded but to tracing log so added tracer"){
                        alert("통계추적에 등록 되지 않았던 캐릭터 ID 입니다. 지금부터 통계추적에 포함시키겠습니다.");
                    }
                    if (charInfo.FAIL == "Character Id not founded"){
                        alert("잘못된 캐릭터 ID 입니다.");
                    }
                    return true;
                }
                resolve({
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
    const ctx = viewLikeGraph.getContext('2d');
    const cdx = viewChatGraph.getContext('2d');
    const ccx = viewCommentGraph.getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: '채팅방수',
                data: data.chatCount,
                borderColor: 'blue',
                fill: false
            }, {
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