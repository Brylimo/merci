# merci
merci project (juneberry diary로 바뀌기 이전 버전 프로젝트)

## 프로젝트 정보
### 메르시(merci)
merci 프로젝트는 juneberry diary의 전신인 프로젝트로 지도 저장, 캘린더를 통해 일상을 기록, 관리하는 서비스입니다.

### merci 프로젝트 작업
- 프로젝트 작업 기간
  - 2023년 8월 15일(프로젝트 첫 커밋) ~ 2023년 3월 14일
  - 블로그 에디터 개발 도중 한계를 느껴 준베리다이어리로 변경
- 프로젝트 개발 투입 인원
  - 1명(나)

## 프로젝트 설명
merci 프로젝트는 juneberry diary와 같이 블로그/다이어리 기능과 캘린더 기록 기능, 지도 기록 기능이 모두 포함된 종합 다이어리 서비스를 지향하며 개발되었으나 지도 기록 기능, 캘린더 기능까지 구현되고 서비스 종료되었습니다. merci 프로젝트는 1)지도에 장소를 저장할 수 있는 기능, 2)캘린더 및 투두리스트 기능, 3)블로그 기능을 사용자에게 제공합니다.

## merci 프로젝트 개발 스택
- 백엔드
  - spring boot, postgresql, spring security, docker, java
- 프론트엔드
  - thymeleaf, jquery, vworld, html, css
  
## 로컬 실행 방법
1. 자바 17버전 설치 및 코드 클론
2. 스프링부트 실행

포트: 8081

## 화면 구성
### 로그인 및 회원가입
![](https://cdn.juneberrydiary.com/c88f7e31-3027-4281-9e65-422180a1782d.png)
![](https://cdn.juneberrydiary.com/4a8e72fb-cae4-4fd0-a890-1291398cf0d8.png)

### 지도
(현재 위치가 분홍색 점으로 표시됩니다.)
![](https://cdn.juneberrydiary.com/032c4db4-314e-4e5c-9d9a-5e1020eedd50.png)
![](https://cdn.juneberrydiary.com/b4d9ba05-24a1-43d6-8a71-ebd3b7fa955e.png)
(하얀색 점이 버스 정류장입니다.)
![](https://cdn.juneberrydiary.com/8e3a35dc-3d8d-4bbc-a26a-1feacc0e68bb.png)
![](https://cdn.juneberrydiary.com/cc616b13-bc01-4e30-a4b3-7c774e344a09.png)
(장소 직접 등록)
![](https://cdn.juneberrydiary.com/312dc7f4-5602-4873-b17d-8c929580764d.png)
(현재 위치 등록)
![](https://cdn.juneberrydiary.com/4f5693c6-30f9-4396-af88-61b11ce4f61b.png)
(검색 위치 등록)
![](https://cdn.juneberrydiary.com/dbcafb41-581e-4844-bad5-5d8025b6bd39.png)

### 캘린더(a.k.a score 페이지) & 투두리스트
![](https://cdn.juneberrydiary.com/a593bca7-d2a5-4886-be3e-bd2027a98c7a.png)
![](https://cdn.juneberrydiary.com/5b180ef7-3dee-49f4-9c4c-16a11425cbbc.png)
![](https://cdn.juneberrydiary.com/5927a33c-f5af-4a6c-af7e-c4494edb91eb.png)
![](https://cdn.juneberrydiary.com/959c9124-9dd5-4844-b6f3-eb3d370249bb.png)

### 블로그 에디터
![](https://cdn.juneberrydiary.com/c88c3c6d-c470-4998-920e-f98912bbc3a3.png)
![](https://cdn.juneberrydiary.com/29d31211-2d20-4c2a-8bc5-dd82f634d988.png)

## 아키텍처
![](https://cdn.juneberrydiary.com/babf5331-adb3-4f6a-9365-55423f324cff.jpg)

## ERD
![](https://cdn.juneberrydiary.com/88963ed0-bc7d-4682-9fc5-0f76f5a83b63.jpg)
