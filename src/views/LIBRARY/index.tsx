import ModalContent from 'components/ModalContent';
import { useState } from 'react';
import './style.css';

interface LibraryContent {
    title:string;
    summary:string;
  desc:LibraryContentDescription;
    skills:string[];
    link:string | null;
    thumbnailUrl:string;
}

interface LibraryContentDescription {
  // 누가
    who:string;
  // 언제부터
    start:string;
  // 언제까지
    end:string;
  // 무엇을 위해
    for:string[];
  // 기타 내용
  detail:string[];
}
//  component 1 : Library Body 컴포넌트 //
export default function Library() {

  //  state : 선택 컨텐츠 상태  //
  const [ content, setContennt ] = useState<LibraryContent>();

  const libraryListMock:LibraryContent[] = [
    {
      title: 'Mrlee-Story',
      summary: '개인PR 홈페이지를 3D 반응형으로 제공하여 한 페이지에서 사용자와의 상호작용이 가능합니다.',
      desc: {
        // 누가
        who: '1인 개발',
        // 언제부터
        start: '2024-06-01',
        // 언제까지
        end: '2024-08-31',
        // 무엇을 위해
        for: [
            '1. 인사 채용 담당자 등 공중 관계의 효율적인 플랫폼이 필요',
            '2. 경력 기간 동안 백엔드와 단위 기술에만 집중되어, 전체 소프트웨어의 흐름에 대한 지식과 이해를 증진',
            '3. 스스로 클라이언트와 개발자의 동시 입장이 되어 시각 차이를 이해',
            '4. 앞만 보며 왔던 지난 경험/경력 정리의 필요성 및 효율적인 경력 관리의 기반을 마련',
        ],
        // 기타 내용
        detail: [
          '1. 인사 채용 담당자의 바쁜 일정을 고려하여 반응형으로 페이지를 제공합니다.',
          '2. 3D와 애니메이션 등을 통해 시각적이고 효율적인 PR을 지원합니다.',
          '3. 개인 소개, 포트폴리오, 토이 프로젝트 링크, 커뮤니케이션(게시판 등)을 한 페이지에서 접할 수 있습니다.',
          '4. 메인 페이지를 3차원 섹션으로 요약하여 전체 페이지 구성을 한눈에 볼 수 있습니다.',
          '5. Notion API를 연동하여, 노션에서 변경하는 포트폴리오 내용을 즉각 가시화할 수 있습니다.',
          '6. 게스트 게시판을 통해 닉네임과 비밀번호만 입력하여 관리자와 소통할 수 있습니다.',
          '7. 개발자가 추후 진행할 다양한 토이 프로젝트를 적재할 수 있는 플랫폼과 서버가 구축되었습니다.'
        ]
      },
      skills: [
        'React', 'TypeScript', 'Java', 'NodeJS', 'SpringBoot', 'PostgreSQL',
        'JWT', 'React-Three-Fiber', 'JPA'
      ],
      link: 'http://144.24.70.238/',
      thumbnailUrl: 'http://144.24.70.238:8080/file/444ee970-92bb-4d17-a76b-231b591e71fa.png',
    }
  ]

  //  event handler : 아이템 선택 버튼 클릭 이벤트 처리: Modal 열기 //

  return (
    <div id="library-container">	

    {
      content && (
        <ModalContent closeModal={() => setContennt(null)}>
          <div className='library-detail-container'>

            <div className='library-detail-title'>
              {content.title}
            </div>
            
            <div className='library-detail-thumbnail'>
              <img src={content.thumbnailUrl} width={'auto'} height={'100%'}/>
            </div>

            <div className='library-detail-contents'>
              <table>
                <tbody>
                  <tr>
                    <th>링크</th>
                    <td>{content.link? 
                        (
                          <a href={content.link} target='_blank' title={content.link}>
                            {content.link}
                          <div className='icon-button-inline-block'>
                              <div className='icon icon-link'></div>
                          </div>
                          </a>
                        )
                        : 
                        '링크 없음(현재 페이지이거나 미배포)'
                        }
                    </td>
                  </tr>

                  <tr>
                    <th>요약</th>
                    <td>
                      {content.summary}
                    </td>
                  </tr>

                  <tr>
                    <th>사용 스킬</th>
                    <td>
                      {
                        content.skills.map( (skill, index) => (
                          <span style={{lineHeight:'7px', display:'inline-block', fontWeight:'bold', backgroundColor: 'rgba(223, 150, 170, 0.5)', marginRight:'5px', padding:'5px', borderRadius:'40% '/* , border:'2px solid black' */}} key={`skill-item-${index}`}>
                            {skill}
                          </span>
                        ))
                      }
                    </td>
                  </tr>

                  <tr>
                    <th>개발 인원<br/>(기간)</th>
                    <td>{`${content.desc.who}`}<br/> {`(${content.desc.start} ~ ${content.desc.end})`}</td>
                  </tr>
                  
                  <tr>
                    <th>개발 동기</th>
                    <td>
                      {
                        content.desc.for.map( (descFor, index) => (
                          <p key={`library-desc-for-${index}`}>
                            {descFor}
                          </p>
                        ))
                      }
                    </td>
                  </tr>

                  <tr>
                    <th>회고</th>
                    <td>
                      {
                        content.desc.detail.map( (detail, index) => (
                          <p key={`library-detail-for-${index}`}>
                            {detail}
                          </p>
                        ))
                      }
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </ModalContent>
      )
    }

      <div className='library-title-box'>
        <h1 className='library-text-title'>Library</h1>
        <p className='library-text-descriptive'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| 다양한 기술을 적용한 토이 프로젝트들을 직접 경험해보세요.</p>
      </div>

      <div className="library-fixed_img_box">
        <ul>
          {
            libraryListMock.map( (item, index) => (
              <li key={`library-each-item-${index}`}>
                <div className='library-anchor-box' onClick={() => setContennt(item)}>
                  <span className="library-thumbnail">
                    <img src={item.thumbnailUrl} alt={item.title} /> 
                    <em>자세히 보기</em>
                  </span> 
                  <strong>{item.title}</strong>
                </div>
                <p>{item.summary}</p>
              </li>
            ))
          }

          <li>
            <div className='library-anchor-box-blank'>
              <span className="library-thumbnail">
                <img src={'/images/icon-progress.png'} alt="개발 중..." /> 
                <em>개발 중</em>
              </span> 
              <strong>컨텐츠 연구 중</strong>
            </div>
            <p>멈추지 않고 공부해서 좋은 경험을 제공하겠습니다.</p>
          </li>
        </ul>

      </div>
    </div>

  )
}
