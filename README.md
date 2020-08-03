# Forte BackEnd Repository

## API
### Naming

* /conversion (가칭)
    * Client로부터 Youtube 링크를 받고, 변환을 진행하는 AI Model 이전의 메시지 큐로 전달하는 API
* /conversion/done (가칭)
    * AI Model로부터 변환이 완료된 형태인 JSON을 전달받는 API
* /conversion/status (가칭)
    * Client에게 현재 변환 상태를 알려줄 API
    * 해당 Youtube 링크에 대한 Row가 없다면 변환이 요청된 적이 없음을 의미
    * 해당 Row의 변환 값을 의미하는 Column 값이 NULL이라면 변환 중임을 의미
    * 해당 Row의 변환 값을 의미하는 Column 값이 JSON이라면 변환이 완료된 결과물을 의미

## Database
### Naming
* converted_link
    * 특정 Youtube Link에 대한 Table
    * Column 1 : id
    * Column 2 : link (Youtube Link)
        * Unique Key로 지정해야 중복된 Youtube Link가 없다.
    * Column 3 : result (Result of Conversion)