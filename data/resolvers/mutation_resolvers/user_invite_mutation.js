import UserInvitesModel from '../models/UserInvites';
const nodemailer = require('nodemailer');
const shortUrl = require('node-url-shortener');

const urlShortenerPromise = function(longUrl) {
  return new Promise(resolve => {
    shortUrl.short(longUrl, (err, url) => {
        console.log('url shortened from %s to %s', longUrl, url)
        resolve(url)
    })
  });
}

const sendEmail = async function(options) {
  console.log('Sending email: host %s smtp %s', process.env.SMTP_HOST, process.env.SMTP_USER)

  const smtpConfig = {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
      },
  }

  const transporter = nodemailer.createTransport(smtpConfig)
  const transportResponse = await transporter.sendMail(options)

  console.log('Transporter returned with', transportResponse);
  return transportResponse;
  return true
}

export const sendUserInvite = (pubsub) => {
    return async (_, args) => {
        const mailTo = args.mail_to.toLowerCase();
        console.log('checking for mail %s resend flag %s', args.mail_to, args.resendFlag);

        const existingUser = await UserInvitesModel.find({email: mailTo})
        console.log('existingUser', existingUser);

        if (existingUser.length === 0) {
          const invitedUser = await new UserInvitesModel({email: mailTo}).save((err, user) => {
            if (err) {
              console.log('Error creating User Invite', err);
              throw new Error(err)
            }

            console.log('invitedUser invite created successfully', user._id);
          });
        } else {
          //  this is a resend scenario
          if (!args.resendFlag) {
            console.log('existing user invite ID', existingUser._id)
            return {code: "RESEND",
              userinviteId: existingUser._id
            };
          }
        }
        const inviteURL = `${process.env.CLIENT_URL}invite`;
        const shortenedURL = await urlShortenerPromise(inviteURL)

        //  ***   Send the email   ***
        const mailOptions = {
            to: mailTo, // list of receivers
            from: '"HHSB Admin" <invite@hiphopscoreboard.com>', // sender address
            subject: 'Be The First: Hip Hop Score Board Invitation',
            html: `
          <p>Thank you for requesting an invite to Hip Hop Score Board!</p>

          <p>Feel free to reply to this message to introduce yourself, suggest ideas, or even join our project.
          You can really help us out by sharing with your friends: ${shortenedURL}</p>

          <p>Thank you,</p>
          <p>HHSB Team</p>
          `
        }

        const email = await sendEmail(mailOptions)

        //  ***   TODO test to see if email was sent   ***
        if (email) {
          console.log('email was sent to', mailTo);
          return {code: "SUCCESS", message: `User invite sent successfully to ${mailTo}.`};
        } else {
          console.log('no email returned');
          return {code: "FAILURE", message: 'Mail transporter failed to return a response'};
        }
    }
}


export const sendUserInviteApproval = (pubsub) => {
    return async (_, args) => {
        const userInviteId = args.user_invite_id;
        const action = args.action;

        const invitedUserResult = await UserInvitesModel.find({_id: userInviteId});
        let invitedUser = invitedUserResult[0];
        invitedUser.status = action;
        console.log("invitedUser", invitedUser);

        const userInvite = await UserInvitesModel.update(
          {_id: userInviteId},
          invitedUser,
          {upsert: true, new: true}
        );

        if ("APPROVED" !== action) {
            return {code: "SUCCESS", message: `User invite request approval declined.`};
        }

        const mailTo = invitedUser.email;
        const inviteURL = `${process.env.CLIENT_URL}signup/${userInviteId}`;
        const shortenedURL = await urlShortenerPromise(inviteURL)

        const mailOptions = {
            to: mailTo, // list of receivers
            from: '"HHSB Admin" <invite@hiphopscoreboard.com>', // sender address
            subject: 'Approved: Hip Hop Score Board Invitation',
            html: `
					<p>Your request for an invite to Hip Hop Score Board has been approved!</p>
					<p>Sign-up here ${shortenedURL}</p>

					<p>Thank you,</p>
					<p>HHSB Team</p>
    			`
        }

        const email = await sendEmail(mailOptions)

        //  ***   TODO test to see if email was sent   ***
        if (email) {
          return {code: "SUCCESS", message: `User sign-up invite sent successfully to ${mailTo}.`};
        } else {
          console.log('no email returned');
          return {code: "FAILURE", message: 'Mail transporter failed to return a response'};
        }
    }
}
