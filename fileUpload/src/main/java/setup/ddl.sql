-------------------------------------------------------------
--  CREATE TABLE
-------------------------------------------------------------
CREATE TABLE fileList (
  fno number(5) primary key,
  name  varchar2(100)  not null,
  sdt date  default sysdate,
  fpath varchar2(300) not null
);

CREATE sequence filelist_seq start WITH 1 increment BY 1;

-------------------------------------------------------------
--  INSERT DATA
-------------------------------------------------------------
INSERT INTO FILELIST (FNO, NAME) VALUES (1, 'ex1.txt');