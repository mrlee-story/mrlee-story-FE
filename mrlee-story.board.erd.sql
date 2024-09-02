-- 게시판
CREATE SEQUENCE seq_board;
CREATE TABLE board
(
  board_number    integer                     NOT NULL DEFAULT nextval('seq_board'),
  title           text                        NOT NULL,
  content         text                        NOT NULL,
  write_date_time timestamp without time zone NOT NULL DEFAULT now(),
  nickname        varchar(10)                 NOT NULL,
  password        character varying(100)      NOT NULL,
  telnumber       char(50)                    NULL    ,
  secret          boolean                     NOT NULL,
  agreed          boolean                     NOT NULL,
  notice          boolean                     NULL     DEFAULT false,
  profile_image   text                        NOT NULL,
  PRIMARY KEY (board_number)
);


-- 댓글
CREATE SEQUENCE seq_comment;
CREATE TABLE comment
(
  comment_number  integer                     NOT NULL DEFAULT nextval('seq_comment'),
  content         text                        NOT NULL,
  write_date_time timestamp without time zone NOT NULL DEFAULT now(),
  nickname        varchar(10)                 NOT NULL,
  board_number    integer                     NOT NULL,
  PRIMARY KEY (comment_number)
);


-- 이미지
CREATE SEQUENCE seq_image;
CREATE TABLE image
(
  seq          integer NOT NULL DEFAULT nextval('seq_image'),
  board_number integer NOT NULL,
  image        text    NOT NULL,
  PRIMARY KEY (seq)
);

-- 제약조건
ALTER TABLE image
  ADD CONSTRAINT FK_board_TO_image
    FOREIGN KEY (board_number)
    REFERENCES board (board_number);

ALTER TABLE comment
  ADD CONSTRAINT FK_board_TO_comment
    FOREIGN KEY (board_number)
    REFERENCES board (board_number);

        
      
        
      