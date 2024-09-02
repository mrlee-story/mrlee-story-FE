import { MilestoneInfo } from "store/notion-api-cache-store";

const workMock:MilestoneInfo[] = [
    {
        thumbnailUrl: "https://prod-files-secure.s3.us-west-2.amazonaws.com/b30af5fc-12d1-4a69-996c-768b655f8817/33502072-0365-49a3-9ff8-a379ac28d43d/%EC%B9%A8%EC%88%98%EC%A0%95%EB%B3%B4%EB%8F%84-2d.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240822%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240822T053718Z&X-Amz-Expires=3600&X-Amz-Signature=d20c8ef676e4b0364fadf5d69e8023e0adacaeec040d0bcbc9c8fc3188d5b796&X-Amz-SignedHeaders=host&x-id=GetObject",
        name: "(사내)침수 예상 범람 2D/3D 가시화 MVP 개발",
        id: "2D-3D-MVP-9b878f5a197b4737a304e5181e2457bf"
    },
    {
        thumbnailUrl: "https://prod-files-secure.s3.us-west-2.amazonaws.com/b30af5fc-12d1-4a69-996c-768b655f8817/4ced1297-7028-42a4-8cab-d5d76b91e215/NC%ED%8C%8C%EC%9D%BC_%EC%97%91%EC%85%80_output.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240822%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240822T053718Z&X-Amz-Expires=3600&X-Amz-Signature=f5f5821a595176dd1795b31f67fa13bc9e1685b0f897adf612e6648ea76f1e22&X-Amz-SignedHeaders=host&x-id=GetObject",
        name: "(사내)NetCDF 파일 Parsing S/W 개발",
        id: "NetCDF-Parsing-S-W-0f2bcb5bbf734139801073e4c1d5b787"
    },
    {
        thumbnailUrl: "https://prod-files-secure.s3.us-west-2.amazonaws.com/b30af5fc-12d1-4a69-996c-768b655f8817/d7683579-21bb-4f8d-8e11-a8861dea81b4/4_false_4_1_16.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240822%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240822T053718Z&X-Amz-Expires=3600&X-Amz-Signature=ffcbb107caa17d5253af56a6ed207903c1482b18be3e455bf8dbc362565413a3&X-Amz-SignedHeaders=host&x-id=GetObject",
        name: "(사내)해양위성 모델(GOCI2) 가시화 MVP 개발",
        id: "GOCI2-MVP-a6a5c99f7d1a43468730ef1cc7bbbbcf"
    },
    {
        thumbnailUrl: "https://prod-files-secure.s3.us-west-2.amazonaws.com/b30af5fc-12d1-4a69-996c-768b655f8817/ffddaa65-99f7-41ca-bb15-d313afea5c17/%ED%83%80%EC%9D%BC%EB%A9%94%EC%9D%B4%EC%BB%A4_v2.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240822%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240822T053718Z&X-Amz-Expires=3600&X-Amz-Signature=3f43258d02f93fd1d5ef903702eb8ccb00dd45e81946d5489a8db77e237ae6ae&X-Amz-SignedHeaders=host&x-id=GetObject",
        name: "배경지도 수동 생성 S/W 개발",
        id: "S-W-d2991a6fbd1b4fc2acfa44013ee6eaad"
    },
    {
        thumbnailUrl: "https://prod-files-secure.s3.us-west-2.amazonaws.com/b30af5fc-12d1-4a69-996c-768b655f8817/595cf5dc-e197-4b8b-8a9f-861f1c3acf29/dinno-3d-viewer.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240822%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240822T053718Z&X-Amz-Expires=3600&X-Amz-Signature=f8300585af48372ee1bf004a3333b1c12bed8d426bcf8682bf155c62eb4e5261&X-Amz-SignedHeaders=host&x-id=GetObject",
        name: "(하청)삼성전자 BIM 사업 MVP 개발",
        id: "BIM-MVP-32e29de035414982a1d7926590fe0b90"
    },
    {
        thumbnailUrl: "https://prod-files-secure.s3.us-west-2.amazonaws.com/b30af5fc-12d1-4a69-996c-768b655f8817/3831a849-4fe1-4a0b-8345-68d5bc0cd946/3d%EB%84%A4%EB%B9%84-%EB%AA%A8%EB%B0%94%EC%9D%BC_%EC%95%B1%EB%B2%84%EC%A0%84.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240822%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240822T053718Z&X-Amz-Expires=3600&X-Amz-Signature=049e0fe58dd60ff46b98b1e958e69813ea3721a9b897c6d828aa192565cd7e40&X-Amz-SignedHeaders=host&x-id=GetObject",
        name: "바다길잡이 서비스 개발",
        id: "674930532b184b1b8f6eb39c26972fe5"
    },
    {
        thumbnailUrl: "https://prod-files-secure.s3.us-west-2.amazonaws.com/b30af5fc-12d1-4a69-996c-768b655f8817/5d59473f-7bd9-4de4-aa28-2f37f08f2c88/%EC%82%AC%EB%82%B4_%EC%84%9C%EB%B2%84%EC%8B%A4_%EA%B5%AC%EC%B6%95_1%28%EC%A0%84%EA%B2%BD%29.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240822%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240822T053718Z&X-Amz-Expires=3600&X-Amz-Signature=a8cd311bbcd5b04d7f5d4938ffb11689d075c07f20b24580027419a5057e509f&X-Amz-SignedHeaders=host&x-id=GetObject",
        name: "사내 서버실 구축 및 관리",
        id: "0dfb0ab2ea314222b802d5b6473c4003"
    },
    {
        thumbnailUrl: "https://prod-files-secure.s3.us-west-2.amazonaws.com/b30af5fc-12d1-4a69-996c-768b655f8817/cc251bec-e94f-4f9e-badd-68cca882e276/XSLTMaker.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240822%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240822T053718Z&X-Amz-Expires=3600&X-Amz-Signature=a46185ee7586c77fd5f2f2b6a75127a48b18c38f38eaf2cba95537d830ea64ad&X-Amz-SignedHeaders=host&x-id=GetObject",
        name: "수로표준(S-12x) 데이터 Parsing S/W 개발",
        id: "S-12x-Parsing-S-W-10ce0fff8c18440496fef4c0a891c3fe"
    },
    {
        thumbnailUrl: "https://prod-files-secure.s3.us-west-2.amazonaws.com/b30af5fc-12d1-4a69-996c-768b655f8817/a877f097-4afd-414c-a278-5fa24178982d/s102.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240822%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240822T053718Z&X-Amz-Expires=3600&X-Amz-Signature=b6a4c744b0b4b52e516161f1aae3e1bfd9a88ed8da62a0beed7bd27898d761be&X-Amz-SignedHeaders=host&x-id=GetObject",
        name: "해저지형 가시화 API 개발",
        id: "API-b0d9a92f592d4a7f8a1f8dd703064a8b"
    },
    {
        thumbnailUrl: "https://prod-files-secure.s3.us-west-2.amazonaws.com/b30af5fc-12d1-4a69-996c-768b655f8817/a9df481d-a25c-466b-a25e-6ed83573a3f6/%EC%9D%98%EC%82%AC%EA%B2%B0%EC%A0%95.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240822%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240822T053718Z&X-Amz-Expires=3600&X-Amz-Signature=80a118652f3343b31517208f4c3545ebcc187df6cff328f5058d08636ca08601&X-Amz-SignedHeaders=host&x-id=GetObject",
        name: "항계안전 실시간 배경지도 API 개발",
        id: "API-bf4ea7188cc24fcf9512c57e07f481c8"
    },
    {
        thumbnailUrl: "https://prod-files-secure.s3.us-west-2.amazonaws.com/b30af5fc-12d1-4a69-996c-768b655f8817/2180c09d-c596-487c-ad04-9b7ce14f096a/%ED%95%AD%EA%B3%84%EC%95%88%EC%A0%84_%EC%84%9C%EB%B2%84.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240822%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240822T053718Z&X-Amz-Expires=3600&X-Amz-Signature=303752edd2f7c7c5e6608c2c841c75e10413fa16b757e328bf2b97caa00de6b1&X-Amz-SignedHeaders=host&x-id=GetObject",
        name: "항계안전 GIS 서버 구축 및 관리",
        id: "GIS-57ef96291e7f480f90a4ac5786bc3869"
    },
    {
        thumbnailUrl: "https://prod-files-secure.s3.us-west-2.amazonaws.com/b30af5fc-12d1-4a69-996c-768b655f8817/51ba7945-89bb-40c9-8b1f-efbf47cc3ddc/%ED%95%B4%EA%B5%B0.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240822%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240822T053718Z&X-Amz-Expires=3600&X-Amz-Signature=9fc24d8f35daa0e11de8d92fab28114289f02f2bf87937dea693153fc1ed36ab&X-Amz-SignedHeaders=host&x-id=GetObject",
        name: "해군 실시간 배경지도 API 개발",
        id: "API-1e345b731d4d4772981bf5a0a9c7fb35"
    },
    {
        thumbnailUrl: "https://prod-files-secure.s3.us-west-2.amazonaws.com/b30af5fc-12d1-4a69-996c-768b655f8817/8e77d1e9-44fa-494e-9ae2-a424ac08e603/%ED%95%B4%EA%B5%B0_%EC%84%9C%EB%B2%84.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240822%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240822T053718Z&X-Amz-Expires=3600&X-Amz-Signature=69a5ff986d95bcf395872a9168c35579217769b1a2499c3a91be172e41bd49bf&X-Amz-SignedHeaders=host&x-id=GetObject",
        name: "해군 GIS 서버 구축 및 관리",
        id: "GIS-09879d97cb904c438017203395980939"
    },
    {
        thumbnailUrl: "https://prod-files-secure.s3.us-west-2.amazonaws.com/b30af5fc-12d1-4a69-996c-768b655f8817/48b7756e-b3d9-4e5d-9255-fd8518d4aa32/%ED%95%B4%EC%95%84%EB%A6%84_%EC%84%9C%EB%B2%84.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240822%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240822T053718Z&X-Amz-Expires=3600&X-Amz-Signature=e1f6bc75380ba0c617ffebc7d86491c7caffc3c2fdb883bbcb2e07cab7d626f4&X-Amz-SignedHeaders=host&x-id=GetObject",
        name: " 해아름 GIS 서버 구축 및 관리",
        id: "GIS-95a40b5e2b4c4bf8b2f0be0d2e6eaf02"
    },
    {
        thumbnailUrl: "https://prod-files-secure.s3.us-west-2.amazonaws.com/b30af5fc-12d1-4a69-996c-768b655f8817/d9a37dd1-ae20-4c46-adea-35c1f63e0b9b/%EC%A0%84%EC%9E%90%ED%95%B4%EB%8F%84_%EB%B3%80%ED%99%98_%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%A8.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240822%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240822T053718Z&X-Amz-Expires=3600&X-Amz-Signature=01d4be2ac94bd6f91f73415eff41b2096e8287676797a58b599af1083ea09c4a&X-Amz-SignedHeaders=host&x-id=GetObject",
        name: "전자해도 데이터 Parsing S/W 개발",
        id: "Parsing-S-W-49f97c769f454101834647e18e877a1c"
    },
    {
        thumbnailUrl: "https://prod-files-secure.s3.us-west-2.amazonaws.com/b30af5fc-12d1-4a69-996c-768b655f8817/ffe14eaf-3ea4-46b2-a3c3-62724aba1659/%EA%B0%9C%EB%B0%A9%ED%95%B4.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240822%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240822T053718Z&X-Amz-Expires=3600&X-Amz-Signature=2c6e130b7b41ef363589661bcc9cbf1c4936fdba3c8e613aed1a90bf9c78d521&X-Amz-SignedHeaders=host&x-id=GetObject",
        name: "해아름 실시간 배경지도 API  개발",
        id: "API-4060ca21ed1f471abc9c5af036b35313"
    }
]

export default workMock;