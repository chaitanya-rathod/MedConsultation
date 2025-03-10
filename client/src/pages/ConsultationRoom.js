import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Videocam as VideocamIcon,
  VideocamOff as VideocamOffIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Send as SendIcon,
  CallEnd as CallEndIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import axios from 'axios';
import io from 'socket.io-client';
import Peer from 'simple-peer';
import AuthContext from '../context/AuthContext';

const ConsultationRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [consultation, setConsultation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  
  const [stream, setStream] = useState(null);
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState('');
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  
  const [showPrescriptionDialog, setShowPrescriptionDialog] = useState(false);
  const [prescriptionData, setPrescriptionData] = useState({
    diagnosis: '',
    medications: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }],
    additionalNotes: ''
  });
  
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  const socketRef = useRef();
  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    const fetchConsultation = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/consultations/${id}`);
        setConsultation(res.data);
        setMessages(res.data.messages || []);
      } catch (err) {
        console.error('Error fetching consultation:', err);
        setError('Failed to load consultation. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchConsultation();
    
    // Initialize socket connection
    socketRef.current = io('http://localhost:5000');
    
    // Get media stream
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        if (myVideo.current) {
          myVideo.current.srcObject = stream;
        }
      })
      .catch(err => {
        console.error('Error accessing media devices:', err);
        alert('Failed to access camera and microphone. Please check permissions.');
      });
    
    return () => {
      // Clean up
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (connectionRef.current) {
        connectionRef.current.destroy();
      }
    };
  }, [id]);
  
  useEffect(() => {
    if (!socketRef.current || !consultation) return;
    
    // Join consultation room
    socketRef.current.emit('join-room', consultation.roomId);
    
    // Handle incoming call
    socketRef.current.on('call-user', (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
    });
    
    // Handle messages
    socketRef.current.on('receive-message', (message) => {
      setMessages(prevMessages => [...prevMessages, message]);
    });
    
    return () => {
      socketRef.current.off('call-user');
      socketRef.current.off('receive-message');
    };
  }, [consultation]);
  
  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const callUser = () => {
    if (!consultation || !stream || !user) {
      console.error('Missing required data for call:', { 
        consultation: !!consultation, 
        stream: !!stream, 
        user: !!user 
      });
      alert('Unable to start call. Please refresh the page and try again.');
      return;
    }
    
    try {
      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream: stream
      });
      
      peer.on('signal', (data) => {
        if (!socketRef.current || !user || !consultation) return;
        
        const userToCall = user.role === 'doctor' && consultation.patient 
          ? consultation.patient._id 
          : (consultation.doctor ? consultation.doctor._id : null);
          
        if (!userToCall) {
          console.error('No recipient found for call');
          alert('Cannot find the other participant');
          return;
        }
        
        console.log('Calling user:', userToCall);
        socketRef.current.emit('call-user', {
          userToCall,
          signalData: data,
          from: user._id,
          name: user.name
        });
      });
      
      peer.on('stream', (remoteStream) => {
        console.log('Received remote stream');
        if (userVideo.current) {
          userVideo.current.srcObject = remoteStream;
        }
      });
      
      peer.on('error', (err) => {
        console.error('Peer connection error:', err);
        alert('Connection error. Please try again.');
      });
      
      socketRef.current.on('call-accepted', (signal) => {
        console.log('Call accepted');
        setCallAccepted(true);
        peer.signal(signal);
      });
      
      connectionRef.current = peer;
    } catch (err) {
      console.error('Error starting call:', err);
      alert('Failed to start call. Please try again.');
    }
  };
  
  const answerCall = () => {
    setCallAccepted(true);
    setReceivingCall(false);
    
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream
    });
    
    peer.on('signal', (data) => {
      socketRef.current.emit('answer-call', { signal: data, to: caller });
    });
    
    peer.on('stream', (stream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    });
    
    peer.signal(callerSignal);
    connectionRef.current = peer;
  };
  
  const leaveCall = () => {
    setCallEnded(true);
    if (connectionRef.current) {
      connectionRef.current.destroy();
    }
  };
  
  const toggleVideo = () => {
    if (stream) {
      try {
        const videoTracks = stream.getVideoTracks();
        if (videoTracks.length > 0) {
          videoTracks.forEach(track => {
            track.enabled = !videoEnabled;
          });
          setVideoEnabled(!videoEnabled);
          console.log('Video toggled:', !videoEnabled);
        } else {
          console.error('No video tracks found in stream');
          alert('No video tracks available');
        }
      } catch (err) {
        console.error('Error toggling video:', err);
        alert('Failed to toggle video');
      }
    } else {
      console.error('No media stream available');
      alert('Camera access is required');
    }
  };
  
  const toggleAudio = () => {
    if (stream) {
      try {
        const audioTracks = stream.getAudioTracks();
        if (audioTracks.length > 0) {
          audioTracks.forEach(track => {
            track.enabled = !audioEnabled;
          });
          setAudioEnabled(!audioEnabled);
          console.log('Audio toggled:', !audioEnabled);
        } else {
          console.error('No audio tracks found in stream');
          alert('No audio tracks available');
        }
      } catch (err) {
        console.error('Error toggling audio:', err);
        alert('Failed to toggle audio');
      }
    } else {
      console.error('No media stream available');
      alert('Microphone access is required');
    }
  };
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !consultation) return;
    
    try {
      const messageData = {
        content: newMessage,
        sender: user._id,
        room: consultation.roomId,
        timestamp: new Date().toISOString()
      };
      
      // Send message to server
      await axios.post(`http://localhost:5000/api/consultations/${id}/messages`, {
        content: newMessage
      });
      
      // Emit message to socket
      socketRef.current.emit('send-message', messageData);
      
      // Add message to local state immediately for better UX
      setMessages(prevMessages => [...prevMessages, {
        content: newMessage,
        sender: user,
        timestamp: new Date().toISOString()
      }]);
      
      // Clear input
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message');
    }
  };
  
  const handleAddMedication = () => {
    setPrescriptionData({
      ...prescriptionData,
      medications: [
        ...prescriptionData.medications,
        { name: '', dosage: '', frequency: '', duration: '', instructions: '' }
      ]
    });
  };
  
  const handleRemoveMedication = (index) => {
    const medications = [...prescriptionData.medications];
    medications.splice(index, 1);
    setPrescriptionData({ ...prescriptionData, medications });
  };
  
  const handleMedicationChange = (index, field, value) => {
    const medications = [...prescriptionData.medications];
    medications[index][field] = value;
    setPrescriptionData({ ...prescriptionData, medications });
  };
  
  const handlePrescriptionChange = (e) => {
    setPrescriptionData({
      ...prescriptionData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleCreatePrescription = async () => {
    try {
      await axios.post('http://localhost:5000/api/prescriptions', {
        consultationId: id,
        ...prescriptionData
      });
      
      setShowPrescriptionDialog(false);
      alert('Prescription created successfully');
    } catch (err) {
      console.error('Error creating prescription:', err);
      alert('Failed to create prescription');
    }
  };
  
  // Format date properly
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }
  
  if (error || !consultation) {
    return (
      <Container>
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography color="error">{error || 'Consultation not found'}</Typography>
        </Paper>
      </Container>
    );
  }
  
  const otherUser = user && consultation ? 
    (user.role === 'doctor' ? consultation.patient : consultation.doctor) : 
    { name: 'Loading...' };
  
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Video Call Section */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h5" component="h2">
                Video Consultation
              </Typography>
              <Box>
                {user.role === 'doctor' && (
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<DescriptionIcon />}
                    onClick={() => setShowPrescriptionDialog(true)}
                    sx={{ mr: 1 }}
                  >
                    Create Prescription
                  </Button>
                )}
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<CallEndIcon />}
                  onClick={() => navigate('/consultations')}
                >
                  Exit
                </Button>
              </Box>
            </Box>
            
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    height: 0,
                    paddingBottom: '56.25%', // 16:9 aspect ratio
                    backgroundColor: 'black',
                    borderRadius: 1,
                    overflow: 'hidden'
                  }}
                >
                  <video
                    playsInline
                    muted
                    ref={myVideo}
                    autoPlay
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 10,
                      left: 10,
                      color: 'white',
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      padding: '2px 8px',
                      borderRadius: 1
                    }}
                  >
                    You ({user.name})
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    height: 0,
                    paddingBottom: '56.25%', // 16:9 aspect ratio
                    backgroundColor: 'black',
                    borderRadius: 1,
                    overflow: 'hidden',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  {callAccepted && !callEnded ? (
                    <video
                      playsInline
                      ref={userVideo}
                      autoPlay
                      style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <Typography color="white">
                      {otherUser.name} is not connected
                    </Typography>
                  )}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 10,
                      left: 10,
                      color: 'white',
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      padding: '2px 8px',
                      borderRadius: 1
                    }}
                  >
                    {otherUser.name}
                  </Box>
                </Box>
              </Grid>
            </Grid>
            
            <Box display="flex" justifyContent="center" gap={2}>
              <IconButton
                onClick={toggleVideo}
                color={videoEnabled ? 'primary' : 'error'}
                sx={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
              >
                {videoEnabled ? <VideocamIcon /> : <VideocamOffIcon />}
              </IconButton>
              <IconButton
                onClick={toggleAudio}
                color={audioEnabled ? 'primary' : 'error'}
                sx={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
              >
                {audioEnabled ? <MicIcon /> : <MicOffIcon />}
              </IconButton>
              {callAccepted && !callEnded ? (
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<CallEndIcon />}
                  onClick={leaveCall}
                >
                  End Call
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<VideocamIcon />}
                  onClick={callUser}
                >
                  Start Call
                </Button>
              )}
            </Box>
            
            {receivingCall && !callAccepted && (
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  backgroundColor: 'primary.light',
                  borderRadius: 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Typography>{otherUser.name} is calling...</Typography>
                <Button variant="contained" color="success" onClick={answerCall}>
                  Answer
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
        
        {/* Chat Section */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Chat
            </Typography>
            
            <Box
              sx={{
                flexGrow: 1,
                overflowY: 'auto',
                maxHeight: '400px',
                mb: 2
              }}
            >
              {messages.length === 0 ? (
                <Typography align="center" color="text.secondary" sx={{ py: 4 }}>
                  No messages yet. Start the conversation!
                </Typography>
              ) : (
                <List>
                  {messages.map((message, index) => (
                    <ListItem
                      key={index}
                      alignItems="flex-start"
                      sx={{
                        flexDirection: message.sender && user && message.sender._id === user._id ? 'row-reverse' : 'row',
                        mb: 1
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar>{message.sender && message.sender.name ? message.sender.name.charAt(0) : '?'}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={message.sender ? message.sender.name : 'Unknown'}
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              sx={{
                                display: 'inline',
                                backgroundColor: message.sender && user && message.sender._id === user._id ? 'primary.light' : 'grey.200',
                                p: 1,
                                borderRadius: 2
                              }}
                            >
                              {message.content}
                            </Typography>
                            <Typography
                              component="span"
                              variant="caption"
                              sx={{ display: 'block', mt: 0.5, textAlign: message.sender && user && message.sender._id === user._id ? 'right' : 'left' }}
                            >
                              {formatDate(message.timestamp)}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                  <div ref={messagesEndRef} />
                </List>
              )}
            </Box>
            
            <Box component="form" onSubmit={handleSendMessage} display="flex">
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                size="small"
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ ml: 1 }}
                disabled={!newMessage.trim()}
              >
                <SendIcon />
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Prescription Dialog */}
      <Dialog
        open={showPrescriptionDialog}
        onClose={() => setShowPrescriptionDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create Prescription</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Diagnosis"
            name="diagnosis"
            value={prescriptionData.diagnosis}
            onChange={handlePrescriptionChange}
            required
          />
          
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
            Medications
          </Typography>
          
          {prescriptionData.medications.map((medication, index) => (
            <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Medication Name"
                    value={medication.name}
                    onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Dosage"
                    value={medication.dosage}
                    onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Frequency"
                    value={medication.frequency}
                    onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Duration"
                    value={medication.duration}
                    onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Instructions"
                    value={medication.instructions}
                    onChange={(e) => handleMedicationChange(index, 'instructions', e.target.value)}
                    multiline
                    rows={2}
                  />
                </Grid>
              </Grid>
              
              {prescriptionData.medications.length > 1 && (
                <Button
                  color="error"
                  onClick={() => handleRemoveMedication(index)}
                  sx={{ mt: 1 }}
                >
                  Remove
                </Button>
              )}
            </Box>
          ))}
          
          <Button
            variant="outlined"
            onClick={handleAddMedication}
            sx={{ mb: 2 }}
          >
            Add Medication
          </Button>
          
          <TextField
            fullWidth
            margin="normal"
            label="Additional Notes"
            name="additionalNotes"
            value={prescriptionData.additionalNotes}
            onChange={handlePrescriptionChange}
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPrescriptionDialog(false)}>Cancel</Button>
          <Button
            onClick={handleCreatePrescription}
            variant="contained"
            color="primary"
          >
            Create Prescription
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ConsultationRoom; 