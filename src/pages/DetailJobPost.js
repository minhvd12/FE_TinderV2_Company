/* eslint-disable camelcase */
import { Card, CardContent, Chip, CircularProgress, Grid, Stack, Tab, Tabs, Typography, ImageList, ImageListItem } from '@mui/material';
import { Box, Container } from '@mui/system';
import axios from 'axios';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ModalImage from 'react-modal-image';
import TabPanel from '../components/TabPanel';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
import Page from '../components/Page';
import { api } from '../constants';
import TableApplicant from '../sections/@dashboard/detailjobpost/TableApplicant';
import '../index.css';

export default function DetailJobPost() {
  const [value, setValue] = useState(1);
  const [jobPostDetail, setJobPostDetail] = useState();
  const [workingStyleDetail, setWorkingStyleDetail] = useState();
  const [jobPositionDetail, setJobPositionDetail] = useState();
  const [albumImageDetail, setAlbumImageDetail] = useState([]);
  const [jobPostSkillDetail, setJobPostSkillDetail] = useState([]);
  const [company, setCompany] = useState();
  const [skillDetail, setSkillDetail] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const { id } = useParams();

  useEffect(() => {
    axios({
      url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_JOBPOST}/${id}`,
      method: 'get',
      // headers: {
      //   'Authorization': `Bearer ${token}`
      // },
    }).then((response) => {
      setJobPostDetail(response.data.data);
      axios({
        url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_WORKINGSTYLE}/${response.data.data.working_style_id}`,
        method: 'get',
        // headers: {
        //   'Authorization': `Bearer ${token}`
        // },
      }).then((response) => {
        setWorkingStyleDetail(response.data.data);
      }).catch(error => console.log(error));

      axios({
        url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_COMPANY}/${response.data.data.company_id}`,
        method: 'get',
        // headers: {
        //   'Authorization': `Bearer ${token}`
        // }
      }).then((response) => {
        setCompany(response.data.data);
      }).catch(error => console.log(error));

      axios({
        url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_JOBPOSITION}/${response.data.data.job_position_id}`,
        method: 'get',
        // headers: {
        //   'Authorization': `Bearer ${token}`
        // },
      }).then((response) => {
        setJobPositionDetail(response.data.data);
      }).catch(error => console.log(error));

      axios({
        url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_ALBUMIMAGE}?jobPostId=${id}`,
        method: 'get',
        // headers: {
        //   'Authorization': `Bearer ${token}`
        // },
      }).then((response) => {
        setAlbumImageDetail(response.data.data);
      }).catch(error => console.log(error));

      axios({
        url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_JOBPOSTSKILL}?jobPostId=${id}`,
        method: 'get',
        // headers: {
        //   'Authorization': `Bearer ${token}`
        // },
      }).then((response) => {
        setSkillDetail([]);
        setJobPostSkillDetail(response.data.data);
        response.data.data.map((jobPostSkill) => axios({
          url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.GET_SKILL}/${jobPostSkill.skill_id}`,
          method: 'get',
          // headers: {
          //   'Authorization': `Bearer ${token}`
          // },
        }).then((response) => {
          setSkillDetail(prevState => ([...prevState, {
            skill: response.data.data.name,
            skillLevel: jobPostSkill.skill_level
          }]));
        }).catch(error => console.log(error)));

      }).catch(error => console.log(error));

      setLoadingData(false);
    }).catch(error => console.log(error));
  }, [id]);

  return (
    <Page title='Chi ti???t b??i vi???t tuy???n d???ng'>
      <Container maxWidth='xl' >

        {loadingData ? (
          <Box style={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <HeaderBreadcrumbs
                heading={jobPostDetail?.title}
                links={[
                  { name: 'B??i vi???t tuy???n d???ng', href: '/company/job-post' },
                  { name: 'Chi ti???t b??i vi???t tuy???n d???ng', href: '/company/job-post/detail' },
                ]}
              />
            </Stack>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={1} style={{ display: 'flex', justifyContent: 'center' }}>
                        <img style={{ borderRadius: '50%', objectFit: 'contain' }} src={company?.logo} alt={company?.name} />
                      </Grid>
                      <Grid item xs={9}>
                        <h3>{jobPostDetail?.title}</h3>
                        <h4 style={{ fontWeight: 'normal' }}>{dayjs(jobPostDetail?.create_date).format('DD-MM-YYYY HH:mm:ss')}</h4>
                      </Grid>
                      <Grid item xs={2} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        {(() => {
                          if (jobPostDetail.status === 0) {
                            return (
                              <Chip
                                label="??ang ho???t ?????ng"
                                color="info"
                              />
                            );
                          }
                          if (jobPostDetail.status === 1) {
                            return (
                              <Chip
                                label='???? h???t h???n'
                                color='warning'
                              />
                            );
                          }
                          if (jobPostDetail.status === 2) {
                            return (
                              <Chip
                                label='??ang duy???t'
                                color='info'
                              />
                            );
                          }
                          if (jobPostDetail.status === 4) {
                            return (
                              <Chip
                                label='Ch??? ho???t ?????ng'
                                color='info'
                              />
                            );
                          }
                          return (
                            <Chip
                              label='T??? ch???i'
                              color='error'
                            />
                          );
                        })()}
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={4}>

                <Card sx={{ mt: 2 }}>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant='h7' component='div'>
                          <Box display='inline' fontWeight='fontWeightBold'>V??? tr?? c??ng vi???c: {' '}</Box>
                          {jobPositionDetail?.name}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant='h7' component='div'>
                          <Box display='inline' fontWeight='fontWeightBold'>S??? l?????ng tuy???n: {' '}</Box>
                          {jobPostDetail?.quantity}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant='h7' component='div'>
                          <Box display='inline' fontWeight='fontWeightBold'>H??nh th???c l??m vi???c: {' '}</Box>
                          {workingStyleDetail?.name}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant='h7' component='div'>
                          <Box display='inline' fontWeight='fontWeightBold'>?????a ??i???m l??m vi???c: {' '}</Box>
                          {jobPostDetail?.working_place}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant='h7' component='div'>
                          <Box display='inline' fontWeight='fontWeightBold'>S??? d??: {' '}</Box>
                          {jobPostDetail?.money} coin
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                <Grid item xs={12} style={{ marginTop: 16 }}>
                  <ImageList variant='standard' cols={2} gap={8}>
                    {albumImageDetail?.map((element, index) => (
                      <ImageListItem key={index}>
                        <ModalImage small={element.url_image} large={element.url_image} className='modal-image-detail' />
                      </ImageListItem>
                    ))}
                  </ImageList>
                </Grid>
              </Grid>

              <Grid item xs={8}>
                <Card sx={{ mt: 2 }}>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <h4>M?? t???:</h4>
                        <h4 style={{ fontWeight: 'normal' }} dangerouslySetInnerHTML={{ __html: jobPostDetail?.description }} />
                      </Grid>
                      <Grid item xs={6}>
                        <h4>B???t ?????u:</h4>
                        <h4 style={{ fontWeight: 'normal' }}>{dayjs(jobPostDetail?.start_time).format('DD-MM-YYYY')}</h4>
                      </Grid>
                      <Grid item xs={6}>
                        <h4>K???t th??c:</h4>
                        <h4 style={{ fontWeight: 'normal' }}>{dayjs(jobPostDetail?.end_time).format('DD-MM-YYYY')}</h4>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                <Card sx={{ mt: 2 }}>
                  <CardContent>
                    <Grid item xs={12}>
                      <h4 style={{ marginRight: 10 }}>K?? n??ng:</h4>
                      {skillDetail.map((element, index) => <Stack key={element.id} spacing={15} direction="row">
                        <Typography variant="body2">???Ng??n ng???: {element.skill}</Typography>
                        <Typography variant="body2">Tr??nh ????? : {element.skillLevel}</Typography>
                      </Stack>)}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            {jobPostDetail.status === 0 || jobPostDetail.status === 1 ? (
              <>
                <Tabs sx={{ mt: 3 }} value={value} onChange={(event, newValue) => setValue(newValue)} aria-label="basic tabs example">
                  <Tab label='Ti???m n??ng' id='simple-tab-0' aria-controls='simple-tabpanel-0'
                    // {...(jobPostDetail.status !== 0 || !company?.is_premium && { disabled: true })}
                    disabled={!!((jobPostDetail.status !== 0 || !company?.is_premium))}
                  // disabled={jobPostDetail.status === 1 && company?.is_premium}

                  // {...( (jobPostDetail.status !== 0 && jobPostDetail.status !== 1 ) || !company?.is_premium && { disabled: true })} 

                  />
                  <Tab label='???ng vi??n' id='simple-tab-1' aria-controls='simple-tabpanel-1' />
                  <Tab label='Quan t??m' id='simple-tab-2' aria-controls='simple-tabpanel-2' />
                  <Tab label='K???t n???i' id='simple-tab-3' aria-controls='simple-tabpanel-3' />
                </Tabs>

                {/* status = 0 => get all profile applicant sort by system
                    status = 1 => get all profile applicant who liked the job post
                    status = 2 => get all profile applicant who company liked
                 */}
                <TabPanel value={value} index={0}>
                  <TableApplicant id={id} status={0} />
                </TabPanel>
                <TabPanel value={value} index={1}>
                  <TableApplicant id={id} status={1} />
                </TabPanel>
                <TabPanel value={value} index={2}>
                  <TableApplicant id={id} status={2} />
                </TabPanel>
                <TabPanel value={value} index={3}>
                  <TableApplicant id={id} status={3} />
                </TabPanel>
              </>
            ) : null}
          </>
        )}
      </Container>
    </Page>
  );
}