import { MilestoneInfo } from "store/notion-api-cache-store";

const projectMock:MilestoneInfo[] = [
    {
        thumbnailUrl: "https://prod-files-secure.s3.us-west-2.amazonaws.com/b30af5fc-12d1-4a69-996c-768b655f8817/1aa21021-b82a-4a7c-baae-08d3b4abf3b5/%EA%B0%9C%EB%B0%A9%ED%95%B4.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240822%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240822T053119Z&X-Amz-Expires=3600&X-Amz-Signature=948cc4bc3ba9f90a32be94d7a970cd47ec04a1b79a6a604d4522007161c6560c&X-Amz-SignedHeaders=host&x-id=GetObject",
        name: "해양배경지도 API 구축 사업(해아름)",
        id: "API-e0170dbf67cd4db6b5b6bf2aad4ce710"
    },
    {
        thumbnailUrl: "https://prod-files-secure.s3.us-west-2.amazonaws.com/b30af5fc-12d1-4a69-996c-768b655f8817/3528e78c-766b-454e-9e9e-010ccaf470af/3d%EB%84%A4%EB%B9%84-%EB%AA%A8%EB%B0%94%EC%9D%BC_%EC%95%B1%EB%B2%84%EC%A0%84.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240822%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240822T053119Z&X-Amz-Expires=3600&X-Amz-Signature=3a90b0d7afd5630dbecb95adbb130a6cb294c1402a99e3494082b7534e17e0a5&X-Amz-SignedHeaders=host&x-id=GetObject",
        name: "3D 바다내비(O-Navi) 연구/개발 사업",
        id: "3D-O-Navi-b9182dc75da54e219e25041b2f61ee22"
    },
    {
        thumbnailUrl: "https://prod-files-secure.s3.us-west-2.amazonaws.com/b30af5fc-12d1-4a69-996c-768b655f8817/fabe84ca-c08e-43a6-a9cd-43281cea8b2b/%EC%9D%98%EC%82%AC%EA%B2%B0%EC%A0%95.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240822%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240822T053119Z&X-Amz-Expires=3600&X-Amz-Signature=aca92de726f61adfce51b5ca25581dac0efed3bf631fd3d02486df73ebfcaec3&X-Amz-SignedHeaders=host&x-id=GetObject",
        name: "해양예보 의사결정 지원시스템 구축 사업",
        id: "db2ce8b6d85644d6bf82c65f8e5a27a6"
    },
    {
        thumbnailUrl: "https://prod-files-secure.s3.us-west-2.amazonaws.com/b30af5fc-12d1-4a69-996c-768b655f8817/5a889548-d041-4526-bc62-199cb6a46cfb/s102.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240822%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240822T053119Z&X-Amz-Expires=3600&X-Amz-Signature=2d0952eb0c0bc5b311b43e7b1d7c464f9b185c566371a8caa8d2729d3a096ad1&X-Amz-SignedHeaders=host&x-id=GetObject",
        name: "차세대 수로제품 표준 연구/개발 사업",
        id: "6cd697952d73493a877bdbfa8817b44c"
    },
    {
        thumbnailUrl: "https://prod-files-secure.s3.us-west-2.amazonaws.com/b30af5fc-12d1-4a69-996c-768b655f8817/abe4bebf-387d-47bc-95ae-9debab331e78/%ED%95%B4%EA%B5%B0.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240822%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240822T053119Z&X-Amz-Expires=3600&X-Amz-Signature=370999dc75cd3551ea61d2604f8229871aabfcd41e65adc760526fb8c9bc8f64&X-Amz-SignedHeaders=host&x-id=GetObject",
        name: "해군 GIS 시스템 구축 사업",
        id: "GIS-af82989cdb2e415ea628a208538ec5a6"
    },
    {
        thumbnailUrl: "https://prod-files-secure.s3.us-west-2.amazonaws.com/b30af5fc-12d1-4a69-996c-768b655f8817/a67141f2-837c-40d5-ab1a-2d4ec24eb6e9/4_false_4_1_16.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45HZZMZUHI%2F20240822%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20240822T053119Z&X-Amz-Expires=3600&X-Amz-Signature=b4c3bdf6255119ac8e7277afe261651718971f6d6a9b4abd3f0b014bc5513eaf&X-Amz-SignedHeaders=host&x-id=GetObject",
        name: "기타 사내 프로젝트",
        id: "b5a3ad6e5e0c48dba8806ad7d862e95d"
    },
]

export default projectMock;