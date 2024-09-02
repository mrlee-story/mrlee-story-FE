import { getNotionProjectDbRequest, getNotionProjectPageRequest, getNotionProjectThumbnailBase64, getNotionWorkDbRequest } from "apis";
import GetNotionDatabaseResponseDto from "apis/response/proxy-notion/get-notion-database.response.dto";
import ResponseDto from "apis/response/response.dto";
import { ExtendedRecordMap } from "notion-types";
import { create } from "zustand";

export interface MilestoneInfo {
    thumbnailUrl:string;
    name:string;
    id:string;
}
interface NotionAPICacheStore {
    isNotionDataLoading:boolean;

    projectCacheList: MilestoneInfo[];
    workCacheList: MilestoneInfo[];

    currentSelectedProjectIdx:number;
    currentSelectedWorkIdx:number;

    pageMap:Map<string, ExtendedRecordMap>;

    setCurrentSelectedProjectIdx:(idx:number) => void;
    setCurrentSelectedWorkIdx:(idx:number) => void;
    
    loadProjectCacheList: () => Promise<boolean>;
    loadWorkCacheList: () => void;
    getPage:(pageId:string, setRecordMap:React.Dispatch<React.SetStateAction<ExtendedRecordMap>>) => void;
}

const useNotionAPICacheStore = create<NotionAPICacheStore>((set, get)=> ({
    isNotionDataLoading: false,
    projectCacheList : [],
    workCacheList : [],

    currentSelectedProjectIdx:0,
    currentSelectedWorkIdx:0,

    pageMap : new Map(),

    setCurrentSelectedProjectIdx: (currentSelectedProjectIdx:number) => set(state => ({...state, currentSelectedProjectIdx})),
    setCurrentSelectedWorkIdx: (currentSelectedWorkIdx:number) => set(state => ({...state, currentSelectedWorkIdx})),

    loadProjectCacheList : async () => {
        set(() => ({isNotionDataLoading:true}))
        const response = await loadProjectList().then((dataList) => {
            set(state => ({projectCacheList:dataList}));
            set(() => ({isNotionDataLoading:false}));
            if (dataList) {
                set(() => ({currentSelectedProjectIdx:Math.floor(dataList.length/2)}))
            }
            return true;
        });
        return response;
        // set(state => ({...state, projectList}));
    },
    loadWorkCacheList : () => {
        set(() => ({isNotionDataLoading:true}))
        loadWorkList().then((dataList) => {
            set(() => ({workCacheList:dataList}));
            set(() => ({isNotionDataLoading:false}));
        });
        // set(state => ({...state, workList}))
    },
    getPage : (pageId:string, setRecordMap:React.Dispatch<React.SetStateAction<ExtendedRecordMap>>) => {
        set(() => ({isNotionDataLoading:true}))
        const pageMap = get().pageMap;
        if (!pageMap.get(pageId)) {
            getNotionProjectPageRequest(pageId).then((responseBody: GetNotionDatabaseResponseDto | ResponseDto | null) => {
                if (!responseBody) return;

                const { code } = responseBody;
                if (code!=='SU') {
                    return;
                }

                const { resultJsonText } = responseBody as GetNotionDatabaseResponseDto;
                const newMap= new Map(pageMap)//ExtendedRecordMap = resultJsonText as ExtendedRecordMap;
                newMap.set(pageId, resultJsonText);
                set(state => ({pageMap:newMap}));
                
                setRecordMap(resultJsonText);
                set(() => ({isNotionDataLoading:false}))
                return;
            });
        } else {
            set(() => ({isNotionDataLoading:false}))
            setRecordMap(pageMap.get(pageId));
            return;
        }
    }
}));

export default useNotionAPICacheStore;

const loadProjectList = async () => {
    const response = await getNotionProjectDbRequest().then(async (responseBody:GetNotionDatabaseResponseDto  | ResponseDto | null) => {
        if (!responseBody) return;

        const { code } = responseBody;
        if (code!=='SU') {
            return;
        }
        
        const { resultJsonText } = responseBody as GetNotionDatabaseResponseDto;
        if (!resultJsonText) return;

        const responseDataArray = resultJsonText.results as any[];

        const dataListPromises = responseDataArray.map(async (item) => {
            const splitPublicUrlArray = item.public_url.split('/');
            const url = item.properties.썸네일.files[0].file.url;

            const imageDataUrl = await loadProjectThumbnailList(url);

            const data: MilestoneInfo = {
                thumbnailUrl: imageDataUrl,
                name: item.properties.이름.title[0].text.content,
                id: splitPublicUrlArray[splitPublicUrlArray.length-1]
            };

            return data;
        });

        const dataList:MilestoneInfo[] = await Promise.all(dataListPromises);
        return dataList;

    });
    return response;
}

const loadProjectThumbnailList = async (url:string) => {
    const response = getNotionProjectThumbnailBase64(url).then( (responseBody) => {
        if (!responseBody) return url;

        // const base64 = Buffer.from(responseBody, 'binary').toString('base64');
        const base64 = btoa(new Uint8Array(responseBody).reduce((data, byte) => data + String.fromCharCode(byte), ''));
        const imageDataUrl = `data:image/jpeg;base64,${base64}`;

        return imageDataUrl;
    });
    return response;
}

const loadWorkList = async () => {
    const response = getNotionWorkDbRequest().then((responseBody:GetNotionDatabaseResponseDto | ResponseDto | null) => {
        if (!responseBody) return;

        const { code } = responseBody;
        if (code!='SU') {
            return;
        }

        const { resultJsonText } = responseBody as GetNotionDatabaseResponseDto;
        if (!resultJsonText) return;
        
        const responseDataArray = resultJsonText.results as any[];

        const dataList:MilestoneInfo[] = [];

        responseDataArray.map((item, index) => {
            const splitPublicUrlArray = item.public_url.split('/');
            const data:MilestoneInfo = {
                thumbnailUrl: item.properties.썸네일.files[0].file.url,
                name: item.properties.이름.title[0].text.content,
                id: splitPublicUrlArray[splitPublicUrlArray.length-1]
            }
            dataList.push(data);
        })
        return dataList;
    })
    return response;
}
