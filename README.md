# Forte BackEnd Repository

## API
### Naming
#### Chord Conversion

* /musicreg (가칭) 
    * Client로부터 Youtube 링크를 받고, 변환을 진행하는 AI Model 이전의 메시지 큐로 전달하는 API
* /musicreg/status (가칭)
    * Client에게 현재 변환 상태를 알려줄 API
    * 해당 Youtube 링크에 대한 Row가 없다면 변환이 요청된 적이 없음을 의미
    * 해당 Row의 변환 값을 의미하는 Column 값이 NULL이라면 변환 중임을 의미
    * 해당 Row의 변환 값을 의미하는 Column 값이 JSON이라면 변환이 완료된 결과물을 의미

#### Chord
* /playmeta
    * GET : AI Model로부터 변환이 완료된 형태인 JSON을 전달받는 API
    * POST : Client에게 변환된 값을 전달해주는 API
    * PUT : Client가 참여하여 Chord를 수정하는 API
    * DELETE : 관리자가 PlayMeta를 삭제하는 API

## Database
### Naming
* converted_link
    * 특정 Youtube Link에 대한 Table
    * Column 1 : link (Youtube Link)
        * 변환요청된 Youtube Link, URI뒤의 해시값만 입력(?)
    * Column 2 : result (Result of Conversion)
        * JSON Data