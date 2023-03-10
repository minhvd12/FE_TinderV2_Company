import PropTypes from 'prop-types';
import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link as RouterLink } from 'react-router-dom';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
// @mui
import {
  TextField,
  Link,
  Card,
  Stack,
  Typography,
  CardHeader,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Box,
  DialogActions,
  Button,
  Snackbar,
  Alert,
  CardContent,
  Chip,
  ImageList,
  ImageListItem,
  Tooltip,
  CircularProgress,DialogContentText
} from '@mui/material';
import ModalImage from 'react-modal-image';
// components
import Iconify from '../../../components/Iconify';

import { api } from '../../../constants';
// ----------------------------------------------------------------------

ConfirmJobPostCard.propTypes = {
  jobpost: PropTypes.object,
  onDeleteRow: PropTypes.func,
  onErrorRow: PropTypes.func,
  onRejectRow: PropTypes.func,
};




export default function ConfirmJobPostCard({ jobpost, onDeleteRow, onErrorRow,onRejectRow }) {
  const [openDialogDetail, setOpenDialogDetail] = useState(false);
  const [openDialogAccept, setOpenDialogAccept] = useState(false);
  const [openDialogReject, setOpenDialogReject] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [severity, setSeverity] = useState('success');
  const [messageAlert, setMessageAlert] = useState('');
  const [jobPostDetail, setJobPostDetail] = useState();
  const [workingStyleDetail, setWorkingStyleDetail] = useState('');
  const [jobPositionDetail, setJobPositionDetail] = useState('');
  const [albumImageDetail, setAlbumImageDetail] = useState([]);
  const [reasons, setReason] = useState('');
  // const [jobPostSkillDetail, setJobPostSkillDetail] = useState([]);
  const [skillDetail, setSkillDetail] = useState([]);
  const [company, setCompany] = useState();
  const [loadingData, setLoadingData] = useState(true);
  // dayjs.extend(isSameOrBefore)
  const handleCloseDialogDetail = () => {
    setOpenDialogDetail(false);
  };
  const handleCloseDialogAccept = () => {
    setOpenDialogAccept(false);
  };
  const handleCloseDialogReject = () => {
    setOpenDialogReject(false);
  };
  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenAlert(false);
  };
  const handleChange = (event) => {
    setReason(event.target.value);
  };
  console.log(jobpost.job_position.name)



  


  useEffect(() => {
    jobpost.job_post_skills.map((jobPostSkill) => axios({
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
      setLoadingData(false)
  }, []);
  dayjs.extend(isSameOrBefore)

  const handleAccept = () => {
if(dayjs(jobpost.start_time).isSameOrBefore(dayjs())){
  axios({
    url: `https://itjobs.azurewebsites.net/api/v1/job-posts/approval?id=${jobpost.id}`,
    method: 'put',       
    data: {
      id: jobpost.id,
      status: 0,
      
    }
  }).then((response) => {
    onDeleteRow();
  }).catch(error => {
    onErrorRow();
    console.log(error);
  });

} else {
  axios({
    url: `https://itjobs.azurewebsites.net/api/v1/job-posts/approval?id=${jobpost.id}`,
    method: 'put',       
    data: {
      id: jobpost.id,
      status: 4,
      
    }
  }).then((response) => {
    onDeleteRow();
  }).catch(error => {
    onErrorRow();
    console.log(error);
  });
}
    
   
    
  };
  const handleReject = () => {
    axios({
      url: `https://itjobs.azurewebsites.net/api/v1/job-posts/approval?id=${jobpost.id}`,
      method: 'put',       
      data: {
        id: jobpost.id,
        reason: reasons,
        status: 3,
        
      }
    }).then((response) => {
      onRejectRow();
       
      
    }).catch(error => {
      onErrorRow();
      console.log(error);
    });
  };

  return (
    <>
    <Card>
       {loadingData ? (
          <Box variant="subtitle2" style={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
      <CardHeader
        disableTypography
        title={
          <Link to="#" variant="subtitle2" color="text.primary" component={RouterLink}>
            {jobpost.title}
          </Link>
        }
        subheader={
          <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
            {dayjs(jobpost.create_date).format('DD-MM-YYYY HH:mm:ss')}
         
          </Typography>
        }
        action={
          <Tooltip title="Xem chi ti???t">
          <IconButton
            onClick={() => {
              setOpenDialogDetail(true);
            }}
            color="info"
          >
            <Iconify icon={'carbon:view-filled'} color="success" width={40} height={40} />
          </IconButton>
          </Tooltip>
        }
      />
 {loadingData ? (
      <Box style={{ display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    ) : (
      <Stack spacing={3} sx={{ p: 3 }}>
        <Typography style={{ fontWeight: 'normal' }} dangerouslySetInnerHTML={{ __html: jobpost.description }}/>

        {/* <ModalImage small={post.business_registration} large={post.business_registration} />; */}
        {/* <Image alt="post media" src={post.business_registration} ratio="16/9" sx={{ borderRadius: 1 }} /> */}
        <TextField
          InputProps={{
            readOnly: true,
          }}
          name="name"
          value={jobpost.quantity}
          label="S??? l?????ng tuy???n"
        />
        <TextField
          InputProps={{
            readOnly: true,
          }}
          name="email"
          value={jobpost.working_style.name}
          label="H??nh th???c l??m vi???c"
        />
        <TextField
          InputProps={{
            readOnly: true,
          }}
          name="phoneNumber"
          value={jobpost.working_place}
          label="?????a ??i???m l??m vi???c"
        />

        <TextField
          InputProps={{
            readOnly: true,
          }}
          name="tax"
          value={jobpost.job_position.name}
          label=" V??? tr?? c??ng vi???c"
        />

        <Grid container>
          <Grid item xs={1}>
            <Typography variant="subtitle2" noWrap>
              &nbsp;
            </Typography>
          </Grid>
          <Grid item xs={4}>
            {/* <Button onClick={() => {
             handleAccept()
            }} variant="contained" color="success">
            Duy???t
          </Button> */}
            <Button
              fullWidth
              onClick={() => {
                setOpenDialogAccept(true)
              }}
              variant="contained"
              endIcon={<Iconify icon={'eva:checkmark-circle-2-fill'} />}
            >
              Duy???t
            </Button>
          </Grid>
          <Grid item xs={2}>
            <Typography variant="subtitle2" noWrap>
              &nbsp;
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Button
              fullWidth
              onClick={() => {
                setOpenDialogReject(true)
              }}
              variant="contained"
              color="error"
              endIcon={<Iconify icon={'eva:close-circle-fill'} />}
            >
              T??? ch???i
            </Button>
            {/* <Button
            onClick={() => {
              handleReject()
            }}
            variant="contained" color="warning">
          
            T??? ch???i
          </Button> */}
          </Grid>
          <Grid item xs={1}>
            <Typography variant="subtitle2" noWrap>
              &nbsp;
            </Typography>
          </Grid>
        </Grid>
      </Stack>
    )}
      <Dialog
        open={openDialogDetail}
        onClose={handleCloseDialogDetail}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="md"
      >
        <DialogTitle id="alert-dialog-title">Th??ng tin b??i tuy???n d???ng</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={1} style={{ display: 'flex', justifyContent: 'center' }}>
                      <img
                        style={{ borderRadius: '50%', objectFit: 'contain' }}
                        src={company?.logo}
                        alt={company?.name}
                      />
                    </Grid>
                    <Grid item xs={9}>
                      <h3>{jobpost.title}</h3>
                      <h4 style={{ fontWeight: 'normal' }}>
                        {dayjs(jobpost.create_date).format('DD-MM-YYYY HH:mm:ss')}
                      </h4>
                    </Grid>
                    <Grid item xs={2} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Chip label=" Ch??? duy???t" color="warning" />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Stack spacing={3}>
                <Card>
                  <CardHeader title="Th??ng tin" />

                  <Stack spacing={2} sx={{ p: 3 }}>
                    <Stack direction="row">
                      <Typography variant="h7" component="div">
                        <Box display="inline" fontWeight="fontWeightBold">
                          S??? l?????ng tuy???n:{' '}
                        </Box>
                        {jobpost.quantity}
                      </Typography>
                    </Stack>
                    <Stack direction="row">
                      <Typography variant="h7" component="div">
                        <Box display="inline" fontWeight="fontWeightBold">
                          H??nh th???c l??m vi???c:{' '}
                        </Box>
                        {jobpost.working_style.name}
                      </Typography>
                    </Stack>

                    <Stack direction="row">
                      <Typography variant="h7" component="div">
                        <Box display="inline" fontWeight="fontWeightBold">
                          ?????a ??i???m l??m vi???c:{' '}
                        </Box>
                        {jobpost.working_place}
                      </Typography>
                    </Stack>

                    <Stack direction="row">
                      <Typography variant="h7" component="div">
                        <Box display="inline" fontWeight="fontWeightBold">
                          V??? tr?? c??ng vi???c:{' '}
                        </Box>
                        {jobpost.job_position.name}
                      </Typography>
                    </Stack>
                  </Stack>
                </Card>
                <Typography variant="caption">H??nh ???nh</Typography>
                <Stack direction="row">
                
                  <ImageList  variant="quilted" cols={2} gap={8}>
                    {jobpost.album_images &&
                      jobpost.album_images.map((item) => (
                        <ImageListItem  key={item.id}>
                          {item.url_image && 
                        
                          
                          <ModalImage   small={`${item.url_image}?w=164&h=164&fit=crop&auto=format`} medium={item.url_image} />
                          
                          }
                        </ImageListItem>
                      ))}
                  </ImageList>
                  
                </Stack>
              </Stack>
            </Grid>

            <Grid item xs={12} md={8}>
              <Stack spacing={3}>
                <Card>
                  <CardHeader title="Gi???i thi???u" />

                  <Stack spacing={2} sx={{ p: 3 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <h4>M?? t???:</h4>
                        <h4 style={{ fontWeight: 'normal' }} dangerouslySetInnerHTML={{ __html: jobpost.description }} />
                      </Grid>
                      <Grid item xs={6}>
                        <h4>B???t ?????u:</h4>
                        <h4 style={{ fontWeight: 'normal' }}>
                          {dayjs(jobpost.start_time).format('DD-MM-YYYY')}
                        </h4>
                      </Grid>
                      <Grid item xs={6}>
                        <h4>K???t th??c:</h4>
                        <h4 style={{ fontWeight: 'normal' }}>{dayjs(jobpost.end_time).format('DD-MM-YYYY')}</h4>
                      </Grid>
                    </Grid>
                  </Stack>
                </Card>
                <Card>
                  <CardHeader title="K??? n??ng y??u c???u" />

                  <Stack spacing={2} sx={{ p: 3 }}>
                    {skillDetail &&
                      skillDetail.map((element) => (
                        <Stack key={element.id} spacing={15} direction="row">
                          <Typography variant="body2">-Ng??n ng???: {element.skill}</Typography>
                          <Typography variant="body2">Tr??nh ????? : {element.skillLevel}</Typography>
                        </Stack>
                      ))}
                  </Stack>
                </Card>
              </Stack>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogDetail} variant="contained">
            ????ng
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
          open={openDialogAccept}
          onClose={handleCloseDialogAccept}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle id="alert-dialog-title"> X??c nh???n duy???t</DialogTitle>
          <DialogActions>
            <Button onClick={handleCloseDialogAccept} variant="outlined" color="inherit">
              Hu???
            </Button>
            <Button
              onClick={() => {
                
                handleAccept();
                handleCloseDialogAccept();
              }}
              variant="contained"
              color="primary"
            >
              Duy???t
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openDialogReject}
          onClose={handleCloseDialogReject}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle  id="alert-dialog-title"> X??c nh???n t??? ch???i</DialogTitle>
          <DialogContent sx={{ pt: 2 }} >
          <DialogContentText id="alert-dialog-slide-description">
          &nbsp;
          </DialogContentText>
              <TextField
                id="outlined-name"
                label="L?? do"
                value={reasons}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialogReject} variant="outlined" color="inherit">
              Hu???
            </Button>
            <Button
              onClick={() => {
                
                handleReject();
                handleCloseDialogReject();
              }}
              variant="contained"
              color="primary"
            >
              T??? ch???i
            </Button>
          </DialogActions>
        </Dialog>
     
      </>
        )}
    </Card>
     <Snackbar
     open={openAlert}
     autoHideDuration={5000}
     onClose={handleCloseAlert}
     anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
   >
     <Alert onClose={handleCloseAlert} severity={severity} sx={{ width: '100%' }} variant="filled">
       {messageAlert}
     </Alert>
   </Snackbar>
   </>
  );
}
