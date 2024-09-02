import { Abilities, Ability } from "types/interface";

const abilityMock: Abilities[] = [
    {
        name: "Dev Skills",
        ability: [
            {
                name: 'Java',
                score: 100,
                descriptive: [
                    '- jdk 내장 클래스로 POJO 지향 웹 API 및 자바 응용 프로그램 개발',
                    '- 멀티 프로세스(TCP Socket)/멀티 스레드 프로그래밍',
                    '- Jar/War 빌드 및 배포 경험',
                    '- GUI(JavaFX), CLI 환경 응용 S/W 개발',
                    '- Java Graphics를 활용한 GIS 프로그램 개발',
                    '- 데이터 타입과 자료구조를 활용하여 성능 개선'
                ]
            },
            {
                name: 'JS/HTML/CSS',
                score: 60,
                descriptive: [
                    '- JS를 사용하여 서버와의 비동기 통신 통한 동적 페이지 및 CSR 구현',
                    '- HTML/CSS를 사용하여 정적 페이지 디자인',
                    '- Vanilla JS와 JQuery로 HTML 계층적 구조 사용',
                ]
            },
            {
                name: 'TypeScript',
                score: 40,
                descriptive: [
                    '- 토이프로젝트를 통하여 TypeScript 학습/개발',
                    '- 타입의 안정성을 보장하는 코드 작성',
                    '- 인터페이스/상속 등을 사용하여 객체지향 코드 작성',
                ]
            },
            {
                name: 'Spring',
                score: 80,
                descriptive: [
                    '- 전자정부 및 Spring Boot 활용 API 개발/배포',
                    '- JSP/thymeleaf 템플릿 활용 SSR 구현',
                    '- 토이 프로젝트 통해 JWT 인증/인가를 구현',
                    '- Spring Security와 Filter Chain 등 생명주기에 대한 내용 이해',
                    '- Maven/Gradle 빌드 도구 사용',
                    '- IoC로 발생하는 컨테이너 내부 생명주기를 이해',
                ]
            },
            {
                name: 'Mybatis',
                score: 80,
                descriptive: [
                    '- SQL Mapping 설정과 동적 SQL, 객체 alias 등 사용 가능',
                    '- SqlSessionFactory 활용 다중 DB 구성 경험',
                ]
            },
            {
                name: 'React',
                score: 40,
                descriptive: [
                    '- 토이 프로젝트 통해 리액트 활용',
                    '- 리액트 훅과 생명주기, CSR에 대해 이해',
                    '- JSX, TSX를 활용한 함수형 컴포넌트 렌더링 개발',
                    '- Zustand 상태관리 도구를 활용한 커스텀 훅 개발',
                ]
            },
        ]
    },{
        name: 'Etc',
        ability: [
            {
                name: 'PostgreSQL',
                score: 100,
                descriptive: [
                    '- postgis, pgroute, dblink, pgcrypto 등 확장 플러그인 사용 경험',
                    '- geometry 타입에 R-tree 기반 인덱싱의 원리를 이해하고 적절히 사용 가능',
                    '- postgis를 활용한 공간 데이터 처리 경험',
                ]
            },
            {
                name: 'Linux',
                score: 70,
                descriptive: [
                    '- CentOS, Ubuntu 서버(폐쇄망) 구축 및 운용 경험',
                    '- crontab을 활용한 스케쥴링 시스템 구축 경험',
                    '- samba를 활용한 외부 스토리지 연동 경험',
                    '- git server, apache-tomcat, apache, geoserver, elastic search 등 구축 경험',
                    '- 포트포워딩, 네트워크 관리 경험',
                    '- 서버 취약점 조치 경험',
                ]
            },
            {
                name: 'Notion',
                score: 60,
                descriptive: [
                    '- 데이터베이스 등 템플릿 제작'
                ]
            },
            {
                name: 'Git',
                score: 20,
                descriptive: [
                    '- git을 활용한 버전 관리를 이해하고, github 활용 경험',
                    '- Synology NAS에 Git Server 구축 경험',
                    '- 브랜치 전략을 이해하고, 보다 활용적인 버전 관리를 위해 학습 중',
                ]
            }
        ]
    }
];

export default abilityMock;