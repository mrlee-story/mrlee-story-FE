interface AboutIntroduceMockType {
    header: string;
    introduceText:{group:string, item:string[]}[];
}

const aboutIntroduceMock:AboutIntroduceMockType = {
    header: 'Introduce',
    introduceText: [
        {
            group: '경력',
            item: [
                '(주)그린블루 (2020.11 ~ 2024.04)'
            ]
        },
        {
            group: '교육',
            item: [
                '부경대학교 자바 개발자 양성 과정 (2020.01 ~ 2020.11)',
                '부경대학교 해양수산경영학과 (2012.03 ~ 2019.02)',
            ]
        },
        {
            group: '자격',
            item: [
                'Cos Pro JAVA (2023. 08. 13)',
                'SQLD (2021. 10. 01)',
                '정보처리기사 (2021. 06. 02)',
                '컴퓨터활용능력 1급 (2018. 10. 26)',
                '워드프로세서 단일등급 (2017. 09. 29)',
            ]
        },
        
       
        // '다양한 공간 데이터를 분석하여 Java GUI/CLI 데이터 Parsing S/W 개발',
        // '개발 서버와 공공기관 운영서버 구축 경험',
        // '너 자신을 알라',
        // '1000번의 망치질을 마주한다면 1번의 망치질을 시작'
    ]
}

export default aboutIntroduceMock;