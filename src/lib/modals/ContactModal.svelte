<!-- Contact/Subscribe Modal -->
<div id="myModal" class="modal fade" role="dialog">
  <div class="modal-dialog">
    <!-- Modal content-->
    <div class="modal-content">
      <div class="modal-header">
				<ul class="nav nav-tabs nav-justified">
				<li class="active"><a href="#contact" class="cont-b" data-toggle="tab">Contact</a></li>
				<li><a href="#subscribe" class="sub-b" data-toggle="tab">Subscribe</a></li>
				</ul>
      </div>
      <div class="modal-body">
				<div class="tab-content">
				<div class="tab-pane active" id="contact">
					<h3 class="text-center">Have Questions?</h3>
					<form role="form" id="contact_form">
				<!-- name field -->
					<div class="form-group">
							<div class="input-group">
									<div class="input-group-addon"><span class="fas fa-user"></span></div>
									<input type="text" class="form-control" id="form-name-field" value="" placeholder="Full Name" required>
							</div>
					</div>
				<!-- email field -->
					<div class="form-group">
							<div class="input-group">
									<div class="input-group-addon"><span class="fas fa-envelope"></span></div>
									<input type="email" class="form-control" id="form-email-field" value="" placeholder="Email" required>
							</div>
					</div>
        <!-- code field -->
          <div class="form-group">
              <div class="input-group">
                  <div class="input-group-addon"><span class="fas fa-barcode"></span></div>
                  <input type="text" class="form-control" id="form-code-field" value="" placeholder="Purchase Code (if avalaible)">
              </div>
          </div>
					<div class="form-group">
					  <textarea class="form-control" rows="5" id="message-form" required></textarea>
					</div>
					<button type="submit" class="btn btn-primary pull-right">Contact</button>
				</form>
				</div>
				<div class="tab-pane" id="subscribe">
					<h3 class="text-center">Subscribe</h3>
					<form role="form" id="subscribe_form">
				<!-- name field -->
					<div class="form-group">
							<div class="input-group">
									<div class="input-group-addon"><span class="fas fa-user"></span></div>
									<input type="text" class="form-control" id="sub-name-field" value="" placeholder="Full Name">
							</div>
					</div>
				<!-- email field -->
					<div class="form-group">
							<div class="input-group">
									<div class="input-group-addon"><span class="fas fa-envelope"></span></div>
									<input type="email" class="form-control" id="sub-email-field" value="" placeholder="Email" required>
							</div>
					</div>
					<button type="submit" class="btn btn-primary pull-right">Subscribe</button>
				</form>
				</div>
				</div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default pull-left" data-dismiss="modal">Close</button>
      </div>
    </div>

  </div>
</div>
